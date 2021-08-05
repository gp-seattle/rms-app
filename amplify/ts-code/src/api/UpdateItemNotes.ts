import { ItemTable } from "../db/ItemTable"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Update notes about a item.
 */
export class UpdateItemNotes {
    public static NAME: string = "update item notes"

    private readonly itemTable: ItemTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.itemTable = new ItemTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: UpdateItemNotesInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, UpdateItemNotes.NAME)
                .then(() => "ID of item:")
        } else if (scratch.id === undefined) {
            return this.transactionsTable.appendToScratch(number, "id", request)
                .then(() => "New Note:")
        } else {
            scratch.note = request
            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params for scratch object:
     * @param id ID of Item
     * @param note String of the new note.
     */
    public execute(input: UpdateItemNotesInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(input)
                    .then(() => this.itemTable.updateItem(input.id, "notes", input.note))
                    .then(() => `Successfully updated notes about item '${input.id}'`)
            },
            UpdateItemNotes.NAME, this.metrics
        )
    }
    private performAllFVAs(input: UpdateItemNotesInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (input.id == undefined) {
                reject(new Error("Missing required field 'id'"))
            } else if (input.note == undefined) {
                reject(new Error("Missing required field 'note'"))
            }
            resolve()
        })
    }
}

export interface UpdateItemNotesInput {
    id?: string
    note?: string
}