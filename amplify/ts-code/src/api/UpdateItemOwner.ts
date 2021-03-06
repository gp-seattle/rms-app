import { ItemTable } from "../db/ItemTable"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Update owner of item.
 */
export class UpdateItemOwner {
    public static NAME: string = "update item owner"

    private readonly itemTable: ItemTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.itemTable = new ItemTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: UpdateItemOwnerInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, UpdateItemOwner.NAME)
                .then(() => "ID of item:")
            } else if (scratch.id === undefined) {
                return this.transactionsTable.appendToScratch(number, "id", request)
                    .then(() => "Current Owner (or location where it's stored if church owned):")
        } else if (scratch.currentOwner === undefined) {
            return this.transactionsTable.appendToScratch(number, "currentOwner", request)
                .then(() => "New Owner (or location where it's stored if church owned):")
        } else {
            scratch.newOwner = request
            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params for scratch object:
     * @param id ID of Item
     * @param currentOwner Name of current owner
     * @param newOwner Name of new owner
     */
    public execute(input: UpdateItemOwnerInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(input)
                    .then(() => this.itemTable.updateItem(input.id, "owner", input.newOwner, input.currentOwner))
                    .then(() => `Successfully updated owner for item '${input.id}'`)
            },
            UpdateItemOwner.NAME, this.metrics
        )
    }
    private performAllFVAs(input: UpdateItemOwnerInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (input.id == undefined) {
                reject(new Error("Missing required field 'id'"))
            } else if (input.currentOwner == undefined) {
                reject(new Error("Missing required field 'currentOwner'"))
            } else if (input.newOwner == undefined) {
                reject(new Error("Missing required field 'newOwner'"))
            }
            resolve()
        })
    }
}

export interface UpdateItemOwnerInput {
    id?: string
    currentOwner?: string
    newOwner?: string
}