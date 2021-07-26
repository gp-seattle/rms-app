import { ItemTable } from "../db/ItemTable"
import { BatchTable } from "../db/BatchTable"
import { SearchIndexSchema } from "../db/Schemas"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Borrow all items in a batch
 */
export class ReturnBatch {
    public static NAME: string = "return batch"

    private readonly itemTable: ItemTable
    private readonly batchTable: BatchTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.itemTable = new ItemTable(client)
        this.batchTable = new BatchTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: ReturnBatchInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, ReturnBatch.NAME)
                .then(() => "Name of Batch:")
        } else if (scratch.name === undefined) {
            return this.transactionsTable.appendToScratch(number, "name", request)
                .then(() => "Name of current borrower:")
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
     * Required params in scratch
     * @param name Name of batch
     * @param borrower Name of borrower
     * @param notes Notes about this action
     */
    public execute(input: ReturnBatchInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(input)
                    .then(() => this.batchTable.get(input.name))
                    .then((entry: SearchIndexSchema) => {
                        if (entry) {
                            return Promise.all(entry.val.values.map((id: string) =>
                                this.itemTable.changeBorrower(id, input.borrower, "return", input.notes)
                            ))
                        } else {
                            throw Error(`Could not find batch '${input.name}'`)
                        }
                    })
                    .then(() => `Successfully returned items in batch '${input.name}'`)
            },
            ReturnBatch.NAME, this.metrics
        )
    }
    
    private performAllFVAs(input: ReturnBatchInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (input.name == undefined) {
                reject(new Error("Missing required field 'name'"))
            } else if (input.borrower == undefined) {
                reject(new Error("Missing required field 'borrower'"))
            }
            resolve()
        })
    }
}

export interface ReturnBatchInput {
    name?: string,
    borrower?: string,
    notes?: string
}