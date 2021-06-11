import { TSV } from "../../../src/handlers/tsv/TSV"
import { DBClient } from "../../../src/injection/db/DBClient"
import { DDBClient } from "../../../src/injection/db/DDBClient"
import { CloudWatchClient } from "../../../src/injection/metrics/CloudWatchClient"
import { MetricsClient } from "../../../src/injection/metrics/MetricsClient"
import { readFile, writeFile } from "fs"
import { userInfo } from "os"

const client: DBClient = new DDBClient({ region: "us-west-2" })
const metrics: MetricsClient = new CloudWatchClient(
    `${userInfo().username}-Local`,
    { region: "us-west-2" }
)

/**
 * CLI to batch download / download the main table.
 * 
 * CONNECTS TO PRODUCTION DATABASE
 * 
 * Run with following command:
 * node CLITSV.js <download/upload> <path to file>
 */
async function run() {
    if (process.argv[2] === "download") {
        await new TSV(client, metrics).download()
            .then((output: string) => writeFile(process.argv[3], output, "utf8", (err) => {
                if (err) {
                    throw err
                } else {
                    console.log(`Done writing tsv to ${process.argv[3]}`)
                }
            }))
    } else if (process.argv[2] === "upload") {
        readFile(process.argv[3], "utf8" , async (err: any, data: Buffer) => {
            if (err) {
                throw err
            } else {
                var input: string = data.toString("utf-8")
                await new TSV(client, metrics).upload(input)
                    .then((ids: string[]) => console.log(`Successfully added items '${ids.toString()}'`))
            }
        })
    } else {
        throw Error("Expected either 'download' or 'upload' as the 3rd parameter.")
    }
}

run()