import { TRANSACTIONS_TABLE } from "./Schemas"
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

export class TransactionsTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Append to scratch space map
     * 
     * @param number Phone Number being used for response.
     * @param key Target variable
     * @param val Value to append
     */
    public appendToScratch(
        number: string,
        key: string,
        val: any
    ): Promise<DocumentClient.UpdateItemOutput> {
        var param: DocumentClient.UpdateItemInput = {
            TableName: TRANSACTIONS_TABLE,
            Key: {
                "number": number
            },
            UpdateExpression: "SET #attr.#key = :val",
            ExpressionAttributeNames: {
                "#attr": "scratch",
                "#key": key
            },
            ExpressionAttributeValues: {
                ":val": val
            }
        }
        return this.client.update(param)
    }

    /**
     * Create new Transaction
     * 
     * @param number Phone Number being used for response.
     * @param type Type of transaction being performed
     * @param scratch Scratch space used by transactions. Initialized as empty.
     */
    public create(
        number: string,
        type: string
    ): Promise<DocumentClient.PutItemOutput> {
        var params: DocumentClient.PutItemInput = {
            TableName: TRANSACTIONS_TABLE,
            Item: {
                "number": number,
                "type": type,
                "scratch": {}
            }
        }
        return this.client.put(params)
    }

    /**
     * Delete by phone number
     * 
     * @param number Phone Number being used for response.
     */
    public delete(
        number: string
    ): Promise<DocumentClient.DeleteItemOutput> {
        var params: DocumentClient.DeleteItemInput = {
            TableName: TRANSACTIONS_TABLE,
            Key: {
                "number": number
            }
        }
        return this.client.delete(params)
    }

    /**
     * Get transaction entry by phone number
     * 
     * @param number Phone Number being used for response.
     */
    public get(
        number: string
    ): Promise<DocumentClient.GetItemOutput> {
        var params: DocumentClient.GetItemInput = {
            TableName: TRANSACTIONS_TABLE,
            Key: {
                "number": number
            }
        }
        return this.client.get(params)
    }
}