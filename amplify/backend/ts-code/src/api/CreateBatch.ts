import { BatchTable } from "../db/BatchTable"
import { SearchIndexSchema } from "../db/Schemas"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Create new batch. Overrides batch if it already exists.
 */
export class CreateBatch {
    public static NAME: string = "create batch"

    private readonly batchTable: BatchTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.batchTable = new BatchTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: CreateBatchInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, CreateBatch.NAME)
                .then(() => "Name of Batch:")
        } else if (scratch.name === undefined) {
            return this.transactionsTable.appendToScratch(number, "name", request)
                .then(() => "List of IDs (separated by spaces):")
        } else {
            scratch.ids = request.split(/(\s+)/)
                .filter((str: string) => str.trim().length > 0)
                .map((str: string) => str.toLowerCase().trim())
            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params in scratch object:
     * @param name Name of batch
     * @param ids List of IDs to include in this batch
     */
    public execute(input: CreateBatchInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(input)
                    .then(() => this.batchTable.get(input.name))
                    .then((entry: SearchIndexSchema) => {
                        if (entry) {
                            return this.batchTable.delete(input.name)
                        } else {
                            return
                        }
                    }).then(() => this.batchTable.create(input.name, input.ids))
                    .then(() => `Successfully created batch '${input.name}'`)
            },
            CreateBatch.NAME, this.metrics
        )
    }
    private performAllFVAs(input: CreateBatchInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (input.name == undefined) {
                reject(new Error("Missing required field 'name'"))
            } else if (input.ids == undefined) {
                reject(new Error("Missing required field 'id'"))
            }
            resolve()
        })
    }
}

export interface CreateBatchInput {
    name?: string
    ids?: string[]
}