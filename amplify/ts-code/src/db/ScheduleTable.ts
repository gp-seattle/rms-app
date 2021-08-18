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
                        .then(() => entry.itemIds.map((itemId: string) => {
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
                                })
                        }).reduce((prev: Promise<any>, next: Promise<any>) => prev.then(() => next), Promise.resolve()))
                        .then(() => entry.itemIds)
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
            .then((output: DocumentClient.GetItemOutput) => output.Item as ScheduleSchema)
    }
}