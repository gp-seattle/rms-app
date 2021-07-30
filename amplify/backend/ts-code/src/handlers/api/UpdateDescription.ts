import { Handler } from "aws-lambda"
import { UpdateDescription, UpdateDescriptionInput } from "../../api/UpdateDescription"
import { DBClient } from "../../injection/db/DBClient"
import { MetricsClient } from "../../injection/metrics/MetricsClient"
import { apiHelper } from "./APIHelper"

export const handler: Handler = async (event: UpdateDescriptionInput): Promise<string> => {
    return apiHelper((dbClient: DBClient, metricsClient: MetricsClient) => new UpdateDescription(dbClient, metricsClient).execute(event))
}