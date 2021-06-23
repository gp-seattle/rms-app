import { MAIN_TABLE, ItemSchema, ITEMS_TABLE, SecondaryIndexSchema } from "./Schemas";
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { AWSError } from "aws-sdk";

export class ItemTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Adds item to inventory
     */
    public create(
        id: string,
        name: string,
        owner: string,
        notes: string
    ): Promise<DocumentClient.PutItemOutput> {
        return this.get(id)
            .then((entry: SecondaryIndexSchema) => {
                if (entry) {
                    throw Error(`RMS ID ${id} is not unique.`)
                } else {
                    const item: ItemSchema = {
                        owner: owner,
                        notes: notes,
                        borrower: ""
                    }
                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": name
                        },
                        UpdateExpression: "SET #attr.#key = :val",
                        ExpressionAttributeNames: {
                            "#attr": "items",
                            "#key": id
                        },
                        ExpressionAttributeValues: {
                            ":val": item
                        }
                    }
            
                    const indexItem: SecondaryIndexSchema = {
                        key: id,
                        val: name
                    }
                    const indexParams: DocumentClient.PutItemInput = {
                        TableName: ITEMS_TABLE,
                        Item: indexItem
                    }

                    return this.client.update(mainParams)
                        .then(() => this.client.put(indexParams))        
                }
            })
    }

    /**
     * Delete Item if exists. Returns corresponding name of item
     */
    public delete(
        id: string
    ): Promise<string> {
        return this.get(id)
            .then((entry: SecondaryIndexSchema) => {
                if (entry) {
                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": entry.val
                        },
                        UpdateExpression: "REMOVE #attr.#id",
                        ConditionExpression: "attribute_not_exists(#attr.#id.#key)",
                        ExpressionAttributeNames: {
                            "#attr": "items",
                            "#id": id,
                            "#key": "batch"
                        }
                    }

                    const itemsParams: DocumentClient.DeleteItemInput = {
                        TableName: ITEMS_TABLE,
                        Key: {
                            "key": id
                        }
                    }

                    return this.client.update(mainParams)
                        .catch((reason: AWSError) => {
                            if (reason.code ===  "ConditionalCheckFailedException") {
                                throw Error(`Item ${id} still belongs to batches. Need to remove item from batch before proceeding with removal.`)
                            } else {
                                throw reason
                            }
                        })
                        .then(() => this.client.delete(itemsParams))
                        .then(() => entry.val)
                } else {
                    throw Error(`Item ${id} doesn't exist.`)
                }
            })
    }

    /**
     * Get name from id
     */
    public get(
        id: string
    ): Promise<SecondaryIndexSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "key": id
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as SecondaryIndexSchema)
    }
}