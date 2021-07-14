import { Handler } from "aws-lambda"
import { ReturnBatch, ReturnBatchInput } from "../../api/ReturnBatch"
import { DBClient } from "../../injection/db/DBClient"
import { MetricsClient } from "../../injection/metrics/MetricsClient"
import { apiHelper } from "./APIHelper"

export const handler: Handler = async (event: ReturnBatchInput): Promise<string> => {
    return apiHelper((dbClient: DBClient, metricsClient: MetricsClient) => new ReturnBatch(dbClient, metricsClient).execute(event))
}