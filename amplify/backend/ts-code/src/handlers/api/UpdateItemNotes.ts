import { Handler } from "aws-lambda"
import { UpdateItemNotes, UpdateItemNotesInput } from "../../api/UpdateItemNotes"
import { DBClient } from "../../injection/db/DBClient"
import { MetricsClient } from "../../injection/metrics/MetricsClient"
import { apiHelper } from "./APIHelper"

export const handler: Handler = async (event: UpdateItemNotesInput): Promise<string> => {
    return apiHelper((dbClient: DBClient, metricsClient: MetricsClient) => new UpdateItemNotes(dbClient, metricsClient).execute(event))
}