import { Handler } from "aws-lambda"
import { BorrowBatch, BorrowBatchInput } from "../../api/BorrowBatch"
import { DBClient } from "../../injection/db/DBClient"
import { MetricsClient } from "../../injection/metrics/MetricsClient"
import { apiHelper } from "./APIHelper"

export const handler: Handler = async (event: BorrowBatchInput): Promise<string> => {
    return apiHelper((dbClient: DBClient, metricsClient: MetricsClient) => new BorrowBatch(dbClient, metricsClient).execute(event))
}