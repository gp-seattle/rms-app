import { PrintTable } from "../../api/internal/PrintTable";
import { AddItem } from "../../api/AddItem";
import { ItemTable } from "../../db/ItemTable";
import { MainSchema, SecondaryIndexSchema } from "../../db/Schemas";
import { DBClient } from "../../injection/db/DBClient";
import { MetricsClient } from "../../injection/metrics/MetricsClient";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * Interact with Main Table by TSV.
 * 
 * Has capabilities to download the latest table in the form of a TSV
 * and update the latest table from a TSV.
 */
export class TSV {
    private readonly client: DBClient
    private readonly metrics?: MetricsClient

    public constructor(client: DBClient, metrics?: MetricsClient) {
        this.client = client
        this.metrics = metrics
    }

    /**
     * Download file, outputting basic information in the form of a TSV.
     * 
     * @returns TSV formatted string of the current database
     */
    public download(): Promise<string> {
        return this.getNextPage(new PrintTable(this.client, this.metrics))
            .then((output: string) => KEYS.join("\t") + output)
    }

    private getNextPage(printTable: PrintTable, exclusiveStartKey?: DocumentClient.Key): Promise<string> {
        return printTable.execute({
            tableName: "main",
            ExclusiveStartKey: exclusiveStartKey
        }).then((output: DocumentClient.ScanOutput) => {
            let outputString = ""
            output.Items.forEach((dbItem: MainSchema) => {
                Object.keys(dbItem.items).forEach((id: string) => {
                    const item: OutputCSVItem = {
                        id: id,
                        name: dbItem.name,
                        description: dbItem.description,
                        tags: dbItem.tags ? dbItem.tags.values.join(" ") : "",
                        owner: dbItem.items[id].owner,
                        notes: dbItem.items[id].notes
                    }
                    outputString += "\n" + Object.values(item).join("\t")
                })
            })
            if (output.LastEvaluatedKey) {
                return this.getNextPage(printTable, output.LastEvaluatedKey)
                    .then((followingOutput: string) => outputString + followingOutput)
            } else {
                return outputString
            }
        })
    }

    /**
     * Will iterate through the list of items in the TSV, uploading them to the main database.
     * 
     * If item doesn't exist, then will add item.
     * 
     * @param filepath Path to input file
     * @throws when header is not as expected.
     */
    public upload(csv: string): Promise<string[]> {
        const itemTable: ItemTable = new ItemTable(this.client)
        const addItem: AddItem = new AddItem(this.client, this.metrics)

        const rows: string[] = csv.split("\n")

        const header: string[] = rows.shift().split("\t")
        if (this.arrayEquals(header, KEYS)) {
            console.log(header.toString())
            throw Error(`Header needs to have the following: '${KEYS.toString()}'`)
        }

        const ids: string[] = []
        return Promise.all(rows.map((row: string) => {
            const values: string[] = row.split("\t")
            const item: InputCSVItem = {
                id: values[0].toLowerCase().trim(),
                name: values[1].toLowerCase().trim(),
                description: values[2].toLowerCase().trim(),
                tags: values[3].trim().split(/(\s+)/)
                    .filter((str: string) => str.trim().length > 0)
                    .map((str: string) => str.toLowerCase().trim()),
                owner: values[4].toLowerCase().trim(),
                notes: values[5].toLowerCase().trim()
            }
            return itemTable.get(item.id)
                .then((entry: SecondaryIndexSchema) => {
                    if (entry) {
                        // ID already exists. Do nothing.
                        return
                    } else {
                        // ID doesn't exist. Go ahead and add item.
                        return addItem.execute(item)
                            .then(() => { ids.push(item.id) })
                    }
                })
            
        })).then(() => ids)
    }

    private arrayEquals(a: string[], b: string[]) {
        return a.length === b.length &&
          a.every((val: string, index: number) => val === b[index]);
      }
}

interface OutputCSVItem {
    id: string,
    name: string,
    description: string,
    tags: string,
    owner: string,
    notes: string
}

interface InputCSVItem {
    id: string,
    name: string,
    description: string,
    tags: string[],
    owner: string,
    notes: string
}

const KEYS: string[] = ["id", "name", "description", "tags", "owner", "notes"]