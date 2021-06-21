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
                if (tagEntry && tagEntry.val.values.includes(name)) {
                    // Contains tag already. Do nothing.
                    return
                } else {
                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": name
                        },
                        UpdateExpression: "ADD #key :val",
                        ExpressionAttributeNames: {
                            "#key": "tags"
                        },
                        ExpressionAttributeValues: {
                            ":val": this.client.createSet([tag])
                        }
                    }

                    return this.client.update(mainParams)
                        .then(() => {
                            if (tagEntry) {
                                // Index exists, so update
                                const updateParam: DocumentClient.UpdateItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "key": tag
                                    },
                                    UpdateExpression: "ADD #key :val",
                                    ExpressionAttributeNames: {
                                        "#key": "val"
                                    },
                                    ExpressionAttributeValues: {
                                        ":val": this.client.createSet([name])
                                    }
                                }
                                return this.client.update(updateParam)
                            } else {
                                // Index doesn't exists, so put
                                const putItem: SearchIndexSchema = {
                                    key: tag,
                                    val: this.client.createSet([name])
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
                if (tagEntry && tagEntry.val.values.includes(name)) {
                    const mainUpdateParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": name
                        },
                        UpdateExpression: "DELETE #key :val",
                        ExpressionAttributeNames: {
                            "#key": "tags"
                        },
                        ExpressionAttributeValues: {
                            ":val": this.client.createSet([tag])
                        }
                    }

                    return this.client.update(mainUpdateParams)
                        .then(() => {
                            if (tagEntry.val.values.length === 1) {
                                const tagDeleteParams: DocumentClient.DeleteItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "key": tag
                                    }
                                }
                                return this.client.delete(tagDeleteParams)
                            } else {
                                const tagUpdateParams: DocumentClient.UpdateItemInput = {
                                    TableName: TAGS_TABLE,
                                    Key: {
                                        "key": tag
                                    },
                                    UpdateExpression: "DELETE #key :val",
                                    ExpressionAttributeNames: {
                                        "#key": "val"
                                    },
                                    ExpressionAttributeValues: {
                                        ":val": this.client.createSet(([name]))
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
                "name": name
            }
        }
        return this.client.get(mainParam)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: MainSchema = data.Item as MainSchema
                    const curTags = entry.tags ? entry.tags.values : []
                    const createTags = tags.filter((newTag: string) => !curTags.includes(newTag))
                    const deleteTags = curTags.filter((curTag: string) => !tags.includes(curTag))
                    return Promise.all([this.create(name, createTags), this.delete(name, deleteTags)])
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
                "key": tag
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as SearchIndexSchema)
    }
}