import { MAIN_TABLE,  MainSchema, ITEMS_TABLE, SecondaryIndexSchema, HISTORY_TABLE, HistorySchema } from "./Schemas"
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
            name: name,
            displayName: "",
            description: description,
            items: {}
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
                if (Object.keys(entry.items).length !== 0) {
                    throw Error(`Entry '${name}' still contains items.`)
                } else if (entry.tags !== undefined) {
                    throw Error(`Entry '${name}' still contains tags.`)
                } else {
                    const params: DocumentClient.DeleteItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            name: name
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
                "name": name
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
                "name": name
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

    /**
     * Update item attribute
     */
    public updateItem(
        id: string,
        key: "owner" | "notes",
        val: string,
        expectedValue?: string
    ): Promise<DocumentClient.GetItemOutput> {
        const itemSearchParams: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "key": id
            }
        }
        return this.client.get(itemSearchParams)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: SecondaryIndexSchema = data.Item as SecondaryIndexSchema
                    return this.get(entry.val)
                } else {
                    throw Error(`Couldn't find item ${id} in the database.`)
                }
            }).then((entry: MainSchema) => {
                if (expectedValue !== undefined && entry.items[id][key] !== expectedValue) {
                    throw Error(`'${key}' is currently '${entry.items[id][key]}', `
                        + `which isn't equal to the expected value of '${expectedValue}'.`)
                } else {
                    const updateParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": entry.name
                        },
                        UpdateExpression: "SET #attr1.#attr2.#key = :val",
                        ExpressionAttributeNames: {
                            "#attr1": "items",
                            "#attr2": id,
                            "#key": key
                        },
                        ExpressionAttributeValues: {
                            ":val": val
                        }
                    }
                    return this.client.update(updateParams)
                }
            })
    }

    /**
     * Special update function, specific for changing the borrower of a item.
     */
    public changeBorrower(
        id: string,
        borrower: string,
        action: "borrow" | "return",
        notes: string
    ) {
        return this.updateBorrowStatus(id, borrower, action)
            .then((name: string) => this.createHistoryEntry(name, id, borrower, action, notes))
    }

    private updateBorrowStatus(
        id: string,
        borrower: string,
        action: "borrow" | "return"
    ): Promise<string> {
        const expectedBorrower: string = (action === "borrow") ? "" : borrower
        const nextBorrower: string = (action === "borrow") ? borrower : ""

        const itemSearchParams: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "key": id
            }
        }
        return this.client.get(itemSearchParams)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: SecondaryIndexSchema = data.Item as SecondaryIndexSchema
                    return this.get(entry.val)
                } else {
                    throw Error(`Couldn't find item ${id} in the database.`)
                }
            }).then((entry: MainSchema) => {
                if (entry.items[id].borrower !== expectedBorrower) {
                    if (action === "borrow") {
                        throw Error("Unable to borrow item: "
                            + `Item is currently being borrowed by '${entry.items[id].borrower}'.`)
                    } else {
                        throw Error("Unable to return item: "
                            + `Borrower in database is '${entry.items[id].borrower}', `
                            + `which isn't equal to the specified borrower of '${expectedBorrower}'.`)
                    }
                } else {
                    const updateParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": entry.name
                        },
                        UpdateExpression: "SET #attr1.#attr2.#key = :val",
                        ExpressionAttributeNames: {
                            "#attr1": "items",
                            "#attr2": id,
                            "#key": "borrower"
                        },
                        ExpressionAttributeValues: {
                            ":val": nextBorrower
                        }
                    }
                    return this.client.update(updateParams)
                        .then(() => entry.name)
                }
            })
    }

    /**
     * Create new entry in borrow history table
     */
    private createHistoryEntry(
        name: string,
        id: string,
        borrower: string,
        action: "borrow" | "return",
        notes: string
    ): Promise<DocumentClient.PutItemOutput> {
        const curEpochMs: number = Date.now()
        const key: string = `${curEpochMs}-${id}`
        const item: HistorySchema = {
            key: key,
            name: name,
            id: id,
            borrower: borrower,
            action: action,
            notes: notes,
            timestamp: curEpochMs
        }
        const addHistoryParams: DocumentClient.PutItemInput = {
            TableName: HISTORY_TABLE,
            Item: item
        }

        const updateMainParams: DocumentClient.UpdateItemInput = {
            TableName: MAIN_TABLE,
            Key: {
                "name": name
            },
            UpdateExpression: "ADD #attr1.#attr2.#key :val",
            ExpressionAttributeNames: {
                "#attr1": "items",
                "#attr2": id,
                "#key": "history"
            },
            ExpressionAttributeValues: {
                ":val": this.client.createSet([key])
            }
        }

        return this.client.put(addHistoryParams)
            .then(() => this.client.update(updateMainParams))
    }
}