import { BATCH_TABLE, BatchSchema, ITEMS_TABLE, ItemsSchema } from "./Schemas"
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
        ids: string[],
        groups: string[]
    ): Promise<any> {
        return Promise.all(ids.map((id: string) => this.attachBatchToItem(name, id)))
            .then(() => {
                const item: BatchSchema = {
                    id: name.toLowerCase(),
                    val: ids,
                    groups: groups
                }

                const params: DocumentClient.PutItemInput = {
                    TableName: BATCH_TABLE,
                    Item: item
                }
                
                return this.client.put(params)
            })
            .catch((reason: any) => {
                // Rollback
                return ids.reduce((prev: Promise<any>, id: string) =>
                    prev.then(() =>
                        this.detachBatchFromItem(name, id)
                        .catch((reason: any) => "Ignore Error")
                    )
                , Promise.resolve())
                .then(() => { throw reason })
            })
    }

    private attachBatchToItem(
        batchName: string,
        id: string
    ): Promise<any> {
        const getParams: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "id": id
            }
        }
        const updateParams: DocumentClient.UpdateItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "id": id
            },
            UpdateExpression: "SET #key = list_append(#key, :val)",
            ExpressionAttributeNames: {
                "#key": "batch"
            },
            ExpressionAttributeValues: {
                ":val": [batchName]
            }
        }
        return this.client.get(getParams)
            .then((entry: DocumentClient.GetItemOutput) => {
                if (entry.Item !== undefined) {
                    return this.client.update(updateParams)
                } else {
                    throw new Error(`Unable to find id '${id}'`)
                }
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
            .then((entry: BatchSchema) => {
                if (entry) {
                    return entry.val.reduce((prev: Promise<any>, id: string) => prev.then(() => this.detachBatchFromItem(name, id)), Promise.resolve())
                        .then(() => {
                            const params: DocumentClient.DeleteItemInput = {
                                TableName: BATCH_TABLE,
                                Key: {
                                    "id": name.toLowerCase()
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
        const getParams: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "id": id
            }
        }
        
        return this.client.get(getParams)
            .then((output: DocumentClient.GetItemOutput) => {
                const item: ItemsSchema = output.Item as ItemsSchema
                if (item) {
                    const idx: number = item.batch.indexOf(batchName)

                    if (idx < 0 || idx >= item.batch.length) {
                        throw Error(`Unable to find batch ${batchName} in item`)
                    }

                    const deleteParams: DocumentClient.UpdateItemInput = {
                        TableName: ITEMS_TABLE,
                        Key: {
                            "id": id
                        },
                        UpdateExpression: `REMOVE #key[${idx}]`,
                        ExpressionAttributeNames: {
                            "#key": "batch"
                        }
                    }
                    return this.client.update(deleteParams)
                } else {
                    throw Error(`Unable to find item ${id}`)
                }
            })
    }

    /**
     * Get list of IDs from Batch Name
     */
    public get(
        name: string
    ): Promise<BatchSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: BATCH_TABLE,
            Key: {
                "id": name.toLowerCase()
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as BatchSchema)
    }
}