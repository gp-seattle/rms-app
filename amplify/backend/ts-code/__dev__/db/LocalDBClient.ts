import { DBSeed } from "./DBTestConstants";
import { DBClient } from "../../src/injection/db/DBClient";
import { AWSError, Schemas } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { PromiseResult } from "aws-sdk/lib/request"
import { 
    MAIN_TABLE, MainSchema,
    ITEMS_TABLE, SecondaryIndexSchema,
    BATCH_TABLE, TAGS_TABLE, SearchIndexSchema,
    TRANSACTIONS_TABLE, TransactionsSchema,
    HISTORY_TABLE, HistorySchema
} from "../../src/db/Schemas"

interface LocalDB {
    main: { [key: string]: MainSchema },
    items: { [key: string]: SecondaryIndexSchema },
    batch: { [key: string]: SearchIndexSchema },
    tags: { [key: string]: SearchIndexSchema },
    history: { [key: string]: HistorySchema },
    transactions: { [key: string]: TransactionsSchema }
}

/**
 * Local instance of DBClient, which stores everything as part of a single object
 */
export class LocalDBClient implements DBClient {

    private db: LocalDB

    constructor(seed: DBSeed = DBSeed.EMPTY) {
        this.db = JSON.parse(JSON.stringify(seed))
    }

    /**
     * Return entire database as a string
     */
    public getDB(): LocalDB {
        return this.db
    }

    public createSet(list: string[]): DocumentClient.StringSet {
        return {
            type: "String",
            values: list
        }
    }

    public delete(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
        return this.newPromise(() => {
            delete this.getTable(params.TableName)[Object.values(params.Key)[0]]
            return {}
        })
    }
    
    public get(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
        return this.newPromise(() => {
            return { Item: this.getTable(params.TableName)[Object.values(params.Key)[0]] }
        })
    }

    public put(params: DocumentClient.PutItemInput): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
        return this.newPromise(() => {
            if (params.TableName === MAIN_TABLE) {
                const val: MainSchema = params.Item as MainSchema
                const key: string = val.name
                this.db.main[key] = val
            } else if (params.TableName === ITEMS_TABLE) {
                const val: SecondaryIndexSchema = params.Item as SecondaryIndexSchema
                const key: string = val.key
                this.db.items[key] = val
            } else if (params.TableName === BATCH_TABLE) {
                const val: SearchIndexSchema = params.Item as SearchIndexSchema
                const key: string = val.key
                this.db.batch[key] = val
            } else if (params.TableName === TAGS_TABLE) {
                const val: SearchIndexSchema = params.Item as SearchIndexSchema
                const key: string = val.key
                this.db.tags[key] = val
            } else if (params.TableName === HISTORY_TABLE) {
                const val: HistorySchema = params.Item as HistorySchema
                const key: string = val.key
                this.db.history[key] = val
            } else if (params.TableName == TRANSACTIONS_TABLE) {
                const val: TransactionsSchema = params.Item as TransactionsSchema
                const key: string = val.number
                this.db.transactions[key] = val
            } else {
                throw new Error("Invalid Table Name: " + params.TableName)
            }
            return {}
        })
    }

    public update(params: DocumentClient.UpdateItemInput): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
        // TODO: Update list append updates, since using sets now.
        return this.newPromise(() => {
            if (params.UpdateExpression === "SET #key = list_append(#key, :val)") {
                // TODO: Maybe a bug, where concatenation is not working
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: string[] = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][key]
                    = this.getTable(params.TableName)[Object.values(params.Key)[0]][key].concat(val)
            } else if (params.UpdateExpression === "SET #key = :val") {
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: any = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][key] = val
            } else if (params.UpdateExpression === "SET #attr.#key = :val") {
                const attr: string = params.ExpressionAttributeNames["#attr"]
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: any = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][attr][key] = val
            } else if (params.UpdateExpression === "SET #attr1.#attr2.#key = :val") {
                const attr1: string = params.ExpressionAttributeNames["#attr1"]
                const attr2: string = params.ExpressionAttributeNames["#attr2"]
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: any = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key] = val
            } else if (params.UpdateExpression === "REMOVE #attr.#id") {
                const attr: string = params.ExpressionAttributeNames["#attr"]
                const id: string = params.ExpressionAttributeNames["#id"]
                delete this.getTable(params.TableName)[Object.values(params.Key)[0]][attr][id]
            } else if (params.UpdateExpression === "REMOVE #key[:idx]") {
                const key: string = params.ExpressionAttributeNames["#key"]
                const idx: string = params.ExpressionAttributeValues[":idx"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][key].splice(idx, 1)
            } else if (params.UpdateExpression === "ADD #key :val") {
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: DocumentClient.StringSet = params.ExpressionAttributeValues[":val"]
                if (this.getTable(params.TableName)[Object.values(params.Key)[0]][key]) {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][key].values
                        = val.values.concat(this.getTable(params.TableName)[Object.values(params.Key)[0]][key].values).sort()
                } else {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][key] = val
                }
            } else if (params.UpdateExpression === "ADD #attr1.#attr2.#key :val") {
                const attr1: string = params.ExpressionAttributeNames["#attr1"]
                const attr2: string = params.ExpressionAttributeNames["#attr2"]
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: DocumentClient.StringSet = params.ExpressionAttributeValues[":val"]
                if (this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key]) {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key].values
                        = val.values.concat(this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key].values).sort()
                } else {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key] = val
                }
            } else if (params.UpdateExpression === "DELETE #key :val") {
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: DocumentClient.StringSet = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][key].values =
                        this.getTable(params.TableName)[Object.values(params.Key)[0]][key].values
                            .filter((el: string) => !val.values.includes(el))
                if (this.getTable(params.TableName)[Object.values(params.Key)[0]][key].values.length == 0) {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][key] = undefined
                }
            } else if (params.UpdateExpression === "DELETE #attr1.#attr2.#key :val") {
                const attr1: string = params.ExpressionAttributeNames["#attr1"]
                const attr2: string = params.ExpressionAttributeNames["#attr2"]
                const key: string = params.ExpressionAttributeNames["#key"]
                const val: DocumentClient.StringSet = params.ExpressionAttributeValues[":val"]
                this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key].values =
                        this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key].values
                            .filter((el: string) => !val.values.includes(el))
                if (this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key].values.length == 0) {
                    this.getTable(params.TableName)[Object.values(params.Key)[0]][attr1][attr2][key] = undefined
                }
            } else {
                throw Error("Unsupported UpdateExpression: " + params.UpdateExpression)
            }

            return {}
        })
    }
    
    // Default to full table scan for now.
    public scan(params: DocumentClient.ScanInput): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> {
        return this.newPromise(() => {
            const table: any[] = Object.values(this.getTable(params.TableName))
            return {
                Items: table,
                Count: table.length,
                ScannedCount: table.length
            }
        })
    }

    private getTable(tableName: string): any {
        if (tableName === MAIN_TABLE) {
            return this.db.main
        } else if (tableName === ITEMS_TABLE) {
            return this.db.items
        } else if (tableName === BATCH_TABLE) {
            return this.db.batch
        } else if (tableName === TAGS_TABLE) {
            return this.db.tags
        } else if (tableName === HISTORY_TABLE) {
            return this.db.history
        } else if (tableName == TRANSACTIONS_TABLE) {
            return this.db.transactions
        } else {
            throw new Error("Invalid Table Name")
        }
    }

    private newPromise<T>(runnable: () => T): Promise<PromiseResult<T, AWSError>> {
        return new Promise((resolve: (value: PromiseResult<T, AWSError>) => void, reject: (reason?: any) => void) => {
            try {
                const response: T = runnable()
                resolve({...response, ...{ $response: null }})
            } catch (err) {
                reject(err)
            }
        })
    }
}