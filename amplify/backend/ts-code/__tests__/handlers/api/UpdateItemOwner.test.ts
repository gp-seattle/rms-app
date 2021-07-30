import getClients from "../../../src/handlers/api/APIHelper"
import { handler } from "../../../src/handlers/api/UpdateItemOwner"
import { DBSeed, TestConstants} from "../../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../../__dev__/db/LocalDBClient"
import { LocalMetricsClient } from "../../../__dev__/metrics/LocalMetricsClient"

test('will update item owner correctly when using handler', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const metricsClient: LocalMetricsClient = new LocalMetricsClient()

    getClients.getDBClient = jest.fn(() => dbClient)
    getClients.getMetricsClient = jest.fn(() => metricsClient)

    await expect(
        handler({
            id: TestConstants.ITEM_ID,
            currentOwner: TestConstants.OWNER,
            newOwner: TestConstants.OWNER_2
        }, null, null)
    ).resolves.toEqual(`Successfully updated owner for item '${TestConstants.ITEM_ID}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME_CHANGE_OWNER)
    metricsClient.assureState(0)
})