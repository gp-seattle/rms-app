import { BatchTable } from "../db/BatchTable"
import { ItemTable } from "../db/ItemTable"
import { SearchIndexSchema } from "../db/Schemas"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Borrow all items in a batch
 */
export class BorrowBatch {
    public static NAME: string = "borrow batch"

    private readonly batchTable: BatchTable
    private readonly itemTable: ItemTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.batchTable = new BatchTable(client)
        this.itemTable = new ItemTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: BorrowBatchInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, BorrowBatch.NAME)
                .then(() => "Name of Batch:")
        } else if (scratch.name === undefined) {
            return this.transactionsTable.appendToScratch(number, "name", request)
                .then(() => "Name of intended borrower:")
        } else if (scratch.borrower === undefined) {
            return this.transactionsTable.appendToScratch(number, "borrower", request)
                .then(() => "Optional notes to leave about this action:")
        } else {
            scratch.notes = request
            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params in scratch object:
     * @param name Name of batch
     * @param borrower Name of borrower
     * @param notes Notes about this action
     */
    public execute(scratch: BorrowBatchInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(scratch)
                    .then(() => this.batchTable.get(scratch.name))
                    .then((entry: SearchIndexSchema) => {
                        if (entry) {
                            return Promise.all(entry.val.map((id: string) =>
                                this.itemTable.changeBorrower(id, scratch.borrower, "borrow", scratch.notes)
                            ))
                        } else {
                            throw Error(`Could not find batch '${scratch.name}'`)
                        }
                    })
                    .then(() => `Successfully borrowed items in batch '${scratch.name}'`)
            },
            BorrowBatch.NAME, this.metrics
        )
    }

    private performAllFVAs(scratch: BorrowBatchInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (scratch.name == undefined) {
                reject(new Error("Missing required field 'name'"))
            } else if (scratch.borrower == undefined) {
                reject(new Error("Missing required field 'borrower'"))
            }
            resolve()
        })
    }
}

export interface BorrowBatchInput {
    name?: string,
    borrower?: string,
    notes?: string
}