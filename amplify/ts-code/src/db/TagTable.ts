import { MAIN_TABLE, MainSchema, TAGS_TABLE, SearchIndexSchema } from "./Schemas"
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

export class TagTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Adds tags to given name
     */
    public create(
        name: string,
        tags: string[]
    ): Promise<any> {
        return Promise.all(tags.map((tag: string) => this.createSingleTag(name, tag)))
    }

    private createSingleTag(
        name: string,
        tag: string
    ): Promise<any> {
        return this.get(tag)
            .then((tagEntry: SearchIndexSchema) => {
                if (tagEntry && tagEntry.val.includes(name)) {
                    // Contains tag already. Do nothing.
                    return
                } else {
                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "id": name.toLowerCase()
                        },
                        UpdateExpression: "SET #key = list_append(#key, :val)",
                        ExpressionAttributeNames: {
                            "#key": "tags"
                        },
                        ExpressionAttributeValues: {
                            ":val": [tag]
                        }
                    }

                    return this.client.update(mainParams)
                        .then(() => {
                            if (tagEntry) {
                                // Index exists, so update
                                const updateParam: DocumentClient.UpdateItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "id": tag
                                    },
                                    UpdateExpression: "SET #key = list_append(#key, :val)",
                                    ExpressionAttributeNames: {
                                        "#key": "val"
                                    },
                                    ExpressionAttributeValues: {
                                        ":val": [name.toLowerCase()]
                                    }
                                }
                                return this.client.update(updateParam)
                            } else {
                                // Index doesn't exists, so put
                                const putItem: SearchIndexSchema = {
                                    id: tag,
                                    val: [name.toLowerCase()]
                                }
                                const putParam: DocumentClient.PutItemInput = {
                                    TableName: TAGS_TABLE,
                                    Item: putItem
                                }
                                return this.client.put(putParam)
                            }
                        })
                }
            })
    }

    /**
     * Delete tags from given name
     */
    public delete(
        name: string,
        tags: string[]
    ): Promise<any> {
        return Promise.all(tags.map((tag: string) => this.deleteSingleTag(name, tag)))
    }

    private deleteSingleTag(
        name: string,
        tag: string
    ): Promise<any> {
        return this.get(tag)
            .then((tagEntry: SearchIndexSchema) => {
                if (tagEntry && tagEntry.val.includes(name)) {
                    const mainGetParams: DocumentClient.GetItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "id": name.toLowerCase()
                        }
                    }

                    return this.client.get(mainGetParams)
                        .then((output: DocumentClient.GetItemOutput) => {
                            const item: MainSchema = output.Item as MainSchema
                            
                            if (item) {
                                const idx: number = item.tags.indexOf(tag)

                                if (idx < 0 || idx >= item.tags.length) {
                                    throw Error(`Unable to find id ${tag} in main`)
                                }

                                
                                const updateMainParams: DocumentClient.UpdateItemInput = {
                                    TableName: MAIN_TABLE,
                                    Key: {
                                        "id": name.toLowerCase()
                                    },
                                    UpdateExpression: "REMOVE #key[:idx]",
                                    ExpressionAttributeNames: {
                                        "#key": "tags"
                                    },
                                    ExpressionAttributeValues: {
                                        ":idx": idx
                                    }
                                }
                                return this.client.update(updateMainParams)
                            } else {
                                throw Error(`Unable to find name ${name.toLowerCase()}`)
                            }
                        }).then(() => {
                            if (tagEntry.val.length === 1) {
                                const tagDeleteParams: DocumentClient.DeleteItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "id": tag
                                    }
                                }
                                return this.client.delete(tagDeleteParams)
                            } else {
                                const idx: number = tagEntry.val.indexOf(name)

                                if (idx < 0 || idx >= tagEntry.val.length) {
                                    throw Error(`Unable to find id ${tag} in main`)
                                }

                                const tagUpdateParams: DocumentClient.UpdateItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "id": tag
                                    },
                                    UpdateExpression: "REMOVE #key[:idx]",
                                    ExpressionAttributeNames: {
                                        "#key": "val"
                                    },
                                    ExpressionAttributeValues: {
                                        ":idx": idx
                                    }
                                }
                                return this.client.update(tagUpdateParams)
                            }
                        })
                } else {
                    // Doesn't contain tag, so do nothing.
                    return
                }
            })
    }

    public update(
        name: string,
        tags: string[]
    ): Promise<any> {
        const mainParam: DocumentClient.GetItemInput = {
            TableName: MAIN_TABLE,
            Key: {
                "id": name.toLowerCase()
            }
        }
        return this.client.get(mainParam)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: MainSchema = data.Item as MainSchema
                    const createTags = tags.filter((newTag: string) => !entry.tags.includes(newTag))
                    const deleteTags = entry.tags.filter((curTag: string) => !tags.includes(curTag))
                    return this.delete(name, deleteTags)
                        .then(() => this.create(name, createTags))
                } else {
                    throw Error(`Could not find '${name}' in the database.`)
                }
            })
    }

    /**
     * Get list of names from tag
     */
    public get(
        tag: string
    ): Promise<SearchIndexSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: TAGS_TABLE,
            Key: {
                "id": tag
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as SearchIndexSchema)
    }
}