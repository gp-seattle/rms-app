import { Handler } from "aws-lambda"
import { UpdateItemOwner, UpdateItemOwnerInput } from "../../api/UpdateItemOwner"
import { DBClient } from "../../injection/db/DBClient"
import { MetricsClient } from "../../injection/metrics/MetricsClient"
import { apiHelper } from "./APIHelper"

export const handler: Handler = async (event: UpdateItemOwnerInput): Promise<string> => {
    return apiHelper((dbClient: DBClient, metricsClient: MetricsClient) => new UpdateItemOwner(dbClient, metricsClient).execute(event))
}