import { MAIN_TABLE,  MainSchema } from "./Schemas"
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

export class MainTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Create new description for item family.
     *
     * Tags and Items are initialized as empty.
     */
    public create(
        name: string,
        description: string
    ): Promise<DocumentClient.PutItemOutput> {
        const item: MainSchema = {
            id: name.toLowerCase(),
            displayName: name,
            description: description
        }
        const params: DocumentClient.PutItemInput = {
            TableName: MAIN_TABLE,
            Item: item
        }
        return this.client.put(params)
    }

    /**
     * Delete description
     *
     * Checks that Tags and Items are empty before proceeding.
     */
    public delete(
        name: string
    ): Promise<DocumentClient.DeleteItemOutput> {
        return this.get(name)
            .then((entry: MainSchema) => {
                if (entry.items !== undefined) {
                    throw Error(`Entry '${name}' still contains items.`)
                } else if (entry.tags !== undefined) {
                    throw Error(`Entry '${name}' still contains tags.`)
                } else {
                    const params: DocumentClient.DeleteItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            name: name.toLowerCase()
                        }
                    }
                    return this.client.delete(params)
                }
            })
    }

    /**
     * Get description of given item type, by name.
     */
    public get(
        name: string
    ): Promise<MainSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: MAIN_TABLE,
            Key: {
                "id": name.toLowerCase()
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as MainSchema)
    }

    /**
     * Update name level attribute
     */
    public update(
        name: string,
        key: string,
        val: string
    ): Promise<DocumentClient.UpdateItemOutput> {
        const params: DocumentClient.UpdateItemInput = {
            TableName: MAIN_TABLE,
            Key: {
                "id": name.toLowerCase()
            },
            UpdateExpression: "SET #key = :val",
            ConditionExpression: 'attribute_exists(#key)',
            ExpressionAttributeNames: {
                "#key": key
            },
            ExpressionAttributeValues: {
                ":val": val
            }
        }
        return this.client.update(params)
    }
}