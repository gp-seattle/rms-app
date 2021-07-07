import { ReturnBatch } from "../../src/api/ReturnBatch"
import { DBSeed, TestConstants, TestTimestamps } from "../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../__dev__/db/LocalDBClient"

test('will return batch correctly when batch borrowed', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
    const api: ReturnBatch = new ReturnBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.RETURN_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES_2
        })
    ).resolves.toEqual(`Successfully returned items in batch '${TestConstants.BATCH}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_RETURNED)
})

// TODO: Race Condition - If one item is partially borrowed, will correctly fail. But then it will still return other items in the batch.
/*
test('will fail to return batch when batch is only partially borrowed', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_PARTIALLY_BORROWED)
    const api: ReturnBatch = new ReturnBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.RETURN_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES_2
        })
    ).rejects.toThrow(`Borrower in database is '', which isn't equal to the specified borrower of '${TestConstants.BORROWER}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_PARTIALLY_BORROWED)
})
*/

test('will fail to return batch when batch is not borrowed', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const api: ReturnBatch = new ReturnBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.RETURN_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES_2
        })
    ).rejects.toThrow(`Unable to return item: Borrower in database is '', which isn't equal to the specified borrower of '${TestConstants.BORROWER}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH)
})

test('will fail to return batch when batch is borrowed by somebody else', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
    const api: ReturnBatch = new ReturnBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.RETURN_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BAD_REQUEST,
            notes: TestConstants.NOTES_2
        })
    ).rejects.toThrow(`Unable to return item: Borrower in database is '${TestConstants.BORROWER}', which isn't equal to the specified borrower of '${TestConstants.BAD_REQUEST}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
})

test('will fail to return batch when batch does not exist', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
    const api: ReturnBatch = new ReturnBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.RETURN_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BAD_REQUEST,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES_2
        })
    ).rejects.toThrow(`Could not find batch '${TestConstants.BAD_REQUEST}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
})