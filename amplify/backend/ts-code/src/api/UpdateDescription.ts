import { MainTable } from "../db/MainTable"
import { TransactionsTable } from "../db/TransactionsTable"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Update description of item family
 */
export class UpdateDescription {
    public static NAME: string = "update description"

    private readonly mainTable: MainTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.mainTable = new MainTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: UpdateDescriptionInput): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, UpdateDescription.NAME)
                .then(() => "Name of item:")
        } else if (scratch.name === undefined) {
            return this.transactionsTable.appendToScratch(number, "name", request)
                .then(() => "New Description:")
        } else {
            scratch.description = request
            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params for scratch object:
     * @param name Name of item
     * @param description New description
     */
    public execute(input: UpdateDescriptionInput): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.performAllFVAs(input)
                    .then(() => this.mainTable.update(input.name, "description", input.description))
                    .then(() => `Successfully updated description of '${input.name}'`)
            },
            UpdateDescription.NAME, this.metrics
        )
    }
    private performAllFVAs(input: UpdateDescriptionInput): Promise<void> {
        return new Promise((resolve, reject) => {
            if (input.name == undefined) {
                reject(new Error("Missing required field 'name'"))
            } else if (input.description == undefined) {
                reject(new Error("Missing required field 'description'"))
            }
            resolve()
        })
    }
}

export interface UpdateDescriptionInput {
    name?: string
    description?: string
}