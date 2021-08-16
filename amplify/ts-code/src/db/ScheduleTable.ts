import { SCHEDULE_TABLE, ScheduleSchema, ITEMS_TABLE, ItemsSchema } from "./Schemas";
import { DBClient } from "../injection/db/DBClient"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

export class ScheduleTable {
    private readonly client: DBClient

    public constructor(client: DBClient) {
        this.client = client
    }

    /**
     * Adds reservation to Schedule Table
     */
    public create(
        id: string,
        borrower: string,
        itemIds: string[],
        startTime: string,
        endTime: string,
        notes: string,
    ): Promise<string> {
        return this.get(id)
            .then((entry: ScheduleSchema) => {
                if (entry) {
                    throw Error(`Schedule ID ${id} is not unique.`)
                } else {
                    const reservation: ScheduleSchema = {
                        id: id,
                        borrower: borrower,
                        itemIds: itemIds,
                        startTime: startTime,
                        endTime: endTime,
                        notes: notes
                    }

                    const indexParams: DocumentClient.PutItemInput = {
                        TableName: SCHEDULE_TABLE,
                        Item: reservation
                    }

                    return this.client.put(indexParams)
                            .then(() => Promise.all((itemIds.map((itemId: string) => {
                                const getItemsParams: DocumentClient.GetItemInput = {
                                    TableName: ITEMS_TABLE,
                                    Key: {
                                        "id": itemId
                                    }
                                }
                                return this.client.get(getItemsParams)
                                .then((output: DocumentClient.GetItemOutput) => {
                                    const item: ItemsSchema = output.Item as ItemsSchema
                                    if (item) {
                                        const itemsParams: DocumentClient.UpdateItemInput = {
                                            TableName: ITEMS_TABLE,
                                            Key: {
                                                "id": itemId
                                            },
                                            UpdateExpression: "SET #key = list_append(#key, :val)",
                                            ExpressionAttributeNames: {
                                                "#key": "schedule"
                                            },
                                            ExpressionAttributeValues: {
                                                ":val": [id]
                                            }
                                        }
        
                                        return this.client.update(itemsParams)
                                    } else {
                                        throw Error(`Unable to find itemId ${itemId}`)
                                    }
                                }).then(() => itemId)
                            }))))
                            .then(() => id)
                }
            })
    }

    /**
     * Delete Schedule if it exists. Returns corresponding name of Schedule
     */
    public delete(
        id: string
    ): Promise<string[]> {
        return this.get(id)
            .then((entry: ScheduleSchema) => {
                if (entry) {

                    const scheduleParams: DocumentClient.DeleteItemInput = {
                        TableName: SCHEDULE_TABLE,
                        Key: {
                            "id": id
                        }
                    }

                    return this.client.delete(scheduleParams)
                        .then(() => Promise.all(entry.itemIds.map((itemId: string) => {
                            const getItemsParams: DocumentClient.GetItemInput = {
                                TableName: ITEMS_TABLE,
                                Key: {
                                    "id": itemId
                                }
                            }
                            return this.client.get(getItemsParams)
                                .then((output: DocumentClient.GetItemOutput) => {
                                    const item: ItemsSchema = output.Item as ItemsSchema
                                    
                                    if (item) {
                                        const updateItemsParams: DocumentClient.UpdateItemInput = {
                                            TableName: ITEMS_TABLE,
                                            Key: {
                                                "id": itemId
                                            },
                                            UpdateExpression: "REMOVE #key[:idx]",
                                            ExpressionAttributeNames: {
                                                "#key": "schedule"
                                            },
                                            ExpressionAttributeValues: {
                                                ":idx": item.schedule.indexOf(id)
                                            }
                                        }
                                        return this.client.update(updateItemsParams)
                                    } else {
                                        throw Error(`Unable to find itemId ${itemId}`)
                                    }
                                }).then(() => itemId)
                        })))
                } else {
                    throw Error(`Schedule ${id} doesn't exist.`)
                }
            })
    }

    /**
     * Get reservation from id
     */
    public get(
        id: string
    ): Promise<ScheduleSchema> {
        const params: DocumentClient.GetItemInput = {
            TableName: SCHEDULE_TABLE,
            Key: {
                "id": id
            }
        }
        return this.client.get(params)
            .then((output: DocumentClient.GetItemOutput) => {
                if (output) { 
                    return output.Item as ScheduleSchema
                } else {
                    throw Error(`Reservation not found: ${id}`)
                }
            })
    }

    /**
     * Update schedule attribute
     */
     public updateReservation(
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
}