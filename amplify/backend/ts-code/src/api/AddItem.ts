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
export class AddItem {
    public static NAME: string = "add item"

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
            return this.transactionsTable.create(number, AddItem.NAME)
                .then(() => "Name of item:")
        } else if (scratch.name === undefined) {
            return this.transactionsTable.appendToScratch(number, "name", request)
                .then(() => this.mainTable.get(request))
                .then((item: MainSchema) => {
                    if (item) {
                        // Item already exists. Just append new item.
                        return this.transactionsTable.appendToScratch(number, "createItem", false)
                            .then(() => "Intended Unique RMS ID number:")
                    } else {
                        // Item doesn't exist, so need to create new item.
                        return this.transactionsTable.appendToScratch(number, "createItem", true)
                            .then(() => "Related Category Tags (separated by spaces):")
                    }
                })
        } else if (scratch.createItem && scratch.tags == undefined) {
            const tags: string[] = request.split(/(\s+)/)
                .filter((str: string) => str.trim().length > 0)
                .map((str: string) => str.toLowerCase().trim())
            return this.transactionsTable.appendToScratch(number, "tags", tags)
                .then(() => "Optional description of this item:")
        } else if (scratch.createItem && scratch.description == undefined) {
            return this.transactionsTable.appendToScratch(number, "description", request)
            .then(() => "Intended Unique RMS ID number:")
        } else if (scratch.id === undefined) {
            return this.transactionsTable.appendToScratch(number, "id", request)
                .then(() => "Owner of this item (or location where it's stored if church owned):")
        } else if (scratch.owner === undefined) {
            return this.transactionsTable.appendToScratch(number, "owner", request)
                .then(() => "Optional notes about this specific item:")
        } else {
            scratch.notes = request

            return this.transactionsTable.delete(number)
                .then(() => this.execute(scratch))
        }
    }

    /**
     * Required params in scratch object:
     * @param id Intended ID of item
     * @param name Name of Item
     * @param description Optional description about the item
     * @param tags Tags to query the item with
     * @param owner Owner of this item (or location where it's stored if church owned)
     * @param tags Notes about this specific item.
     * Params used by router exclusively:
     * @param createItem Flag to indicate item needs to be created (used by the router function)
     */
    public execute(scratch: ScratchInterface): Promise<string> {
        return emitAPIMetrics(
            () => {
                return this.mainTable.get(scratch.name)
                .then((entry: MainSchema) => {
                    if (entry) {
                        // Object Exists. No need to add description
                        return
                    } else {
                        // Add new Object
                        return this.mainTable.create(scratch.name, scratch.description)
                            .then(() => this.tagTable.create(scratch.name, scratch.tags))
                    }
                }).then(() => {
                    return this.itemTable.create(scratch.id, scratch.name, scratch.owner, scratch.notes)
                        .then(() => `Created Item with RMS ID: ${scratch.id}`)       
                })
            },
            AddItem.NAME, this.metrics
        )
        
        
    }
}

interface ScratchInterface {
    id?: string,
    name?: string,
    createItem?: boolean,
    description?: string,
    tags?: string[], 
    owner?: string,
    notes?: string
}