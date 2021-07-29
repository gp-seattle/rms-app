import getClients from "../../../src/handlers/api/APIHelper"
import { handler } from "../../../src/handlers/api/AddItem"
import { DBSeed, TestConstants } from "../../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../../__dev__/db/LocalDBClient"
import { LocalMetricsClient } from "../../../__dev__/metrics/LocalMetricsClient"

test('will add item correctly when using handler', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.EMPTY)
    const metricsClient: LocalMetricsClient = new LocalMetricsClient()

    getClients.getDBClient = jest.fn(() => dbClient)
    getClients.getMetricsClient = jest.fn(() => metricsClient)

    await expect(
        handler({
            id: TestConstants.ITEM_ID,
            name: TestConstants.DISPLAYNAME,
            description: TestConstants.DESCRIPTION,
            tags: [TestConstants.TAG],
            owner: TestConstants.OWNER,
            notes: TestConstants.NOTES
        }, null, null)
    ).resolves.toEqual(`Created Item with RMS ID: ${TestConstants.ITEM_ID}`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
    metricsClient.assureState(0)
})