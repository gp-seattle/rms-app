import { MainTable } from "../db/MainTable"
import { ItemTable } from "../db/ItemTable"
import { TagTable } from "../db/TagTable"
import { TransactionsTable } from "../db/TransactionsTable"
import { MainSchema } from "../db/Schemas"
import { DBClient } from "../injection/db/DBClient"
import { MetricsClient } from "../injection/metrics/MetricsClient"
import { emitAPIMetrics } from "../metrics/MetricsHelper"

/**
 * Adds item to item inventory table.
 */
export class DeleteItem {
    public static NAME: string = "delete item"

    private readonly mainTable: MainTable
    private readonly itemTable: ItemTable
    private readonly tagTable: TagTable
    private readonly transactionsTable: TransactionsTable
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.mainTable = new MainTable(client)
        this.itemTable = new ItemTable(client)
        this.tagTable = new TagTable(client)
        this.transactionsTable = new TransactionsTable(client)
        this.metrics = metrics
    }

    public router(number: string, request: string, scratch?: ScratchInterface): string | Promise<string> {
        if (scratch === undefined) {
            return this.transactionsTable.create(number, DeleteItem.NAME)
                .then(() => "ID of item:")
        } else if (scratch.id === undefined) {
            return this.transactionsTable.appendToScratch(number, "id", request)
                .then(() => `Type 'y' to confirm that you want to delete item: '${request}'`)
        } else {
            if (request === "y") {
                return this.transactionsTable.delete(number)
                    .then(() => this.execute(scratch))
            } else {
                return "ERROR: Didn't receive 'y'. Please reply again with a 'y' to proceed with deleting the object, or 'abort' to abort the transaction."
            }
        }
    }
    /**
     * Required params in scratch object:
     * @param id ID of Item
     */
    public execute(scratch: ScratchInterface): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.itemTable.delete(scratch.id)
                    .then((name: string) => this.mainTable.get(name))
                    .then((entry: MainSchema) => {
                        if (entry.items == undefined) {
                            return this.tagTable.delete(entry.name, entry.tags.values)
                                .then(() => this.mainTable.delete(entry.name))
                                .then(() => entry.name)
                        } else {
                            return entry.name
                        }
                    })
                    .then((name: string) => `Deleted a '${name}' from the inventory.`)
            },
            DeleteItem.NAME, this.metrics
        )
    }
}

interface ScratchInterface {
    id?: string
}