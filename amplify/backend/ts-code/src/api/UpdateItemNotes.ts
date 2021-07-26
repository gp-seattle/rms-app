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

    public router(number: string, request: string, scratch?: ScratchInterface): string | Promise<string> {
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
    public execute(scratch: ScratchInterface): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.itemTable.updateItem(scratch.id, "notes", scratch.note)
                    .then(() => `Successfully updated notes about item '${scratch.id}'`)
            },
            UpdateItemNotes.NAME, this.metrics
        )
    }
}

interface ScratchInterface {
    id?: string
    note?: string
}