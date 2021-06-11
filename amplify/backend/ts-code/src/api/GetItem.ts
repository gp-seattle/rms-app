import { MainTable } from "../db/MainTable"
import { ItemTable } from "../db/ItemTable"
import { TransactionsTable } from "../db/TransactionsTable"
import { MainSchema, SecondaryIndexSchema } from "../db/Schemas"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Get Item either by id or by name.
 */
export class GetItem {
    public static NAME: string = "get item"

    private readonly mainTable: MainTable
    private readonly itemTable: ItemTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.mainTable = new MainTable(client)
        this.itemTable = new ItemTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: ScratchInterface): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, GetItem.NAME)
                .then(() => "Name or ID of item:")
        } else {
            scratch.key = request
            return this.transactionsTable.delete(number)
                    .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params in scratch object:
     * @param key Name or ID of item
     */
    public execute(scratch: ScratchInterface): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.itemTable.get(scratch.key)
                    .then((secondaryEntry: SecondaryIndexSchema) => {
                        if (secondaryEntry) {
                            return this.mainTable.get(secondaryEntry.val)
                                .then((entry: MainSchema) => {
                                    return this.header(entry)
                                        + this.item(entry, scratch.key)
                                })
                        } else {
                            return this.mainTable.get(scratch.key)
                                .then((entry: MainSchema) => {
                                    if (entry) {
                                        var returnString = this.header(entry)
                                        Object.keys(entry.items).forEach((id: string) => returnString += this.item(entry, id))
                                        return returnString
                                    } else {
                                        throw Error(`Couldn't find item '${scratch.key}'`)
                                    }
                                })
                        }
                    })
            },
            GetItem.NAME, this.metrics
        )
    }

    private header(entry: MainSchema): string {
        var tags: string[] = entry.tags ? entry.tags.values : []
        return `name: ${entry.name}`
            + `\ndescription: ${entry.description}`
            + `\ntags: ${tags.toString()}`
            + `\nitems:`
    }

    private item(entry: MainSchema, id: string) {
        var batch: string[] = entry.items[id].batch ? entry.items[id].batch.values : []
        return `\n  id: ${id}`
            + `\n    owner: ${entry.items[id].owner}`
            + `\n    borrower: ${entry.items[id].borrower}`
            + `\n    batch: ${batch}`
            + `\n    notes: ${entry.items[id].notes}`
    }
}

interface ScratchInterface {
    key?: string
}