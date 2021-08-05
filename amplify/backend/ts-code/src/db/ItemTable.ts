import { MAIN_TABLE, ITEMS_TABLE, ItemsSchema, HistorySchema, HISTORY_TABLE } from "./Schemas";
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

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
            .then((entry: ItemsSchema) => {
                if (entry) {
                    throw Error(`RMS ID ${id} is not unique.`)
                } else {
                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": name.toLowerCase()
                        },
                        UpdateExpression: "ADD #key :val",
                        ExpressionAttributeNames: {
                            "#key": "items"
                        },
                        ExpressionAttributeValues: {
                            ":val": this.client.createSet([id])
                        }
                    }

                    const item: ItemsSchema = {
                        id: id,
                        name: name.toLowerCase(),
                        owner: owner,
                        notes: notes,
                        borrower: ""
                    }

                    const indexParams: DocumentClient.PutItemInput = {
                        TableName: ITEMS_TABLE,
                        Item: item
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
            .then((entry: ItemsSchema) => {
                if (entry) {
                    if (entry.batch != undefined) {
                        throw Error(`Item ${id} still belongs to batches. Need to remove item from batch before proceeding with removal.`)
                    }

                    const itemsParams: DocumentClient.DeleteItemInput = {
                        TableName: ITEMS_TABLE,
                        Key: {
                            "id": id
                        }
                    }

                    const mainParams: DocumentClient.UpdateItemInput = {
                        TableName: MAIN_TABLE,
                        Key: {
                            "name": entry.name
                        },
                        UpdateExpression: "DELETE #key :val",
                        ExpressionAttributeNames: {
                            "#key": "items"
                        },
                        ExpressionAttributeValues: {
                            ":val": this.client.createSet(([id]))
                        }
                    }

                    return this.client.delete(itemsParams)
                        .then(() => this.client.update(mainParams))
                        .then(() => entry.name)
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
    ): Promise<ItemsSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: ITEMS_TABLE,
            Key: {
                "id": id
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => output.Item as ItemsSchema)
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
                "id": id
            }
        }
        return this.client.get(itemSearchParams)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: ItemsSchema = data.Item as ItemsSchema

                    if (expectedValue !== undefined && entry[key] !== expectedValue) {
                        throw Error(`'${key}' is currently '${entry[key]}', `
                            + `which isn't equal to the expected value of '${expectedValue}'.`)
                    } else {
                        const updateParams: DocumentClient.UpdateItemInput = {
                            TableName: ITEMS_TABLE,
                            Key: {
                                "id": id
                            },
                            UpdateExpression: "SET #key = :val",
                            ExpressionAttributeNames: {
                                "#key": key
                            },
                            ExpressionAttributeValues: {
                                ":val": val
                            }
                        }
                        return this.client.update(updateParams)
                    }
                } else {
                    throw Error(`Couldn't find item ${id} in the database.`)
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
                "id": id
            }
        }
        return this.client.get(itemSearchParams)
            .then((data: DocumentClient.GetItemOutput) => {
                if (data.Item) {
                    const entry: ItemsSchema = data.Item as ItemsSchema
                    
                    if (entry.borrower !== expectedBorrower) {
                        if (action === "borrow") {
                            throw Error("Unable to borrow item: "
                                + `Item is currently being borrowed by '${entry.borrower}'.`)
                        } else {
                            throw Error("Unable to return item: "
                                + `Borrower in database is '${entry.borrower}', `
                                + `which isn't equal to the specified borrower of '${expectedBorrower}'.`)
                        }
                    } else {
                        const updateParams: DocumentClient.UpdateItemInput = {
                            TableName: ITEMS_TABLE,
                            Key: {
                                "id": id
                            },
                            UpdateExpression: "SET #key = :val",
                            ExpressionAttributeNames: {
                                "#key": "borrower"
                            },
                            ExpressionAttributeValues: {
                                ":val": nextBorrower
                            }
                        }
                        return this.client.update(updateParams)
                            .then(() => entry.name)
                    }
                } else {
                    throw Error(`Couldn't find item ${id} in the database.`)
                }
            })
    }

    /**
     * Create new entry in borrow/return history table
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
            TableName: ITEMS_TABLE,
            Key: {
                "id": id
            },
            UpdateExpression: "ADD #key :val",
            ExpressionAttributeNames: {
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