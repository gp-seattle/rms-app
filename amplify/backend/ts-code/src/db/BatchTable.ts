import { MAIN_TABLE, MainSchema, BATCH_TABLE, SearchIndexSchema, ITEMS_TABLE, SecondaryIndexSchema } from "./Schemas"
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

export class BatchTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Adds specified items to batch. Will override existing batch if exists.
     *
     * @param name Name of Batch
     * @param ids RMS IDs of the items in the Batch
     */
    public create(
        name: string,
        ids: string[]
    ): Promise<any> {
        return Promise.all(ids.map((id: string) => this.attachBatchToItem(name, id)))
            .then(() => {
                const item: SearchIndexSchema = {
                    key: name,
                    val: this.client.createSet(ids)
                }

                const params: DocumentClient.PutItemInput = {
                    TableName: BATCH_TABLE,
                    Item: item
                }
                
                return this.client.put(params)
            })
            .catch((reason: any) => {
                // Rollback
                return Promise.all(ids.map((id: string) =>
                    this.detachBatchFromItem(name, id)
                        .catch((reason: any) => "Ignore Error")
                )).then(() => { throw reason })
            })
    }

    private attachBatchToItem(
        batchName: string,
        id: string
    ): Promise<any> {
        return this.getMainEntryFromId(id)
            .then((mainEntry: MainSchema) => {
                const params: DocumentClient.UpdateItemInput = {
                    TableName: MAIN_TABLE,
                    Key: {
                        "name": mainEntry.name
                    },
                    UpdateExpression: "ADD #attr1.#attr2.#key :val",
                    ExpressionAttributeNames: {
                        "#attr1": "items",
                        "#attr2": id,
                        "#key": "batch"
                    },
                    ExpressionAttributeValues: {
                        ":val": this.client.createSet([batchName])
                    }
                }
                return this.client.update(params)
            })
    }

    /**
     * Delete specified batch by name
     *
     * @param name Name of Batch
     * @param ids RMS IDs of the items in the Batch
     */
    public delete(
        name: string
    ): Promise<any> {
        return this.get(name)
            .then((entry: SearchIndexSchema) => {
                if (entry) {
                    return Promise.all(entry.val.values.map((id: string) => this.detachBatchFromItem(name, id)))
                        .then(() => {
                            const params: DocumentClient.DeleteItemInput = {
                                TableName: BATCH_TABLE,
                                Key: {
                                    "key": name
                                }
                            }
                            
                            return this.client.delete(params)
                        })
                } else {
                    throw new Error(`Batch '${name}' not found.`)
                }
            })
    }

    private detachBatchFromItem(
        batchName: string,
        id: string
    ): Promise<any> {
        return this.getMainEntryFromId(id)
        .then((mainEntry: MainSchema) => {
            const params: DocumentClient.UpdateItemInput = {
                TableName: MAIN_TABLE,
                Key: {
                    "name": mainEntry.name
                },
                UpdateExpression: "DELETE #attr1.#attr2.#key :val",
                ExpressionAttributeNames: {
                    "#attr1": "items",
                    "#attr2": id,
                    "#key": "batch"
                },
                ExpressionAttributeValues: {
                    ":val": this.client.createSet([batchName])
                }
            }
    
            return this.client.update(params)
        })
    }

    private getMainEntryFromId(id: string): Promise<MainSchema> {
        const secondaryParams: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "key": id
            }
        }

        return this.client.get(secondaryParams)
            .then((secondaryData: DocumentClient.GetItemOutput) => {
                if (secondaryData.Item) {
                    const secondaryEntry: SecondaryIndexSchema = secondaryData.Item as SecondaryIndexSchema

                    const mainParams: DocumentClient.GetItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": secondaryEntry.val
                        }
                    }
            
                    return this.client.get(mainParams)
                        .then((data: DocumentClient.GetItemOutput) => {
                            if (data.Item) {
                                return data.Item as MainSchema
                            } else {
                                throw Error(`Unable to find name '${secondaryEntry.val}'`)
                            }
                        })
                } else {
                    throw Error(`Unable to find id '${id}'`)
                }
            })
    }

    /**
     * Get list of IDs from Batch Name
     */
    public get(
        name: string
    ): Promise<SearchIndexSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: BATCH_TABLE,
            Key: {
                "key": name
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as SearchIndexSchema)
    }
}