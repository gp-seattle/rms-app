import getClients from "../../../src/handlers/api/APIHelper"
import { handler } from "../../../src/handlers/api/BorrowBatch"
import { DBSeed, TestConstants, TestTimestamps } from "../../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../../__dev__/db/LocalDBClient"
import { LocalMetricsClient } from "../../../__dev__/metrics/LocalMetricsClient"

test('will borrow batch correctly when using handler', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const metricsClient: LocalMetricsClient = new LocalMetricsClient()

    getClients.getDBClient = jest.fn(() => dbClient)
    getClients.getMetricsClient = jest.fn(() => metricsClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)
    
    await expect(
        handler({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        }, null, null)
    ).resolves.toEqual(`Successfully borrowed items in batch '${TestConstants.BATCH}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
    metricsClient.assureState(0)
})