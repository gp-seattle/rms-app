import { BorrowBatch } from "../../src/api/BorrowBatch"
import { DBSeed, TestConstants, TestTimestamps } from "../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../__dev__/db/LocalDBClient"

test('will borrow batch correctly when batch exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const api: BorrowBatch = new BorrowBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        })
    ).resolves.toEqual(`Successfully borrowed items in batch '${TestConstants.BATCH}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
})

// TODO: Race Condition - If one item is partially borrowed, will correctly fail. But then it still might borrow other items in the batch.
/*
test('will fail to borrow batch when single item already borrowed', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_PARTIALLY_BORROWED)
    const api: BorrowBatch = new BorrowBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`Unable to borrow item: Item is currently being borrowed by '${TestConstants.BORROWER}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_PARTIALLY_BORROWED)
})
*/

test('will fail to borrow batch when batch already borrowed', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
    const api: BorrowBatch = new BorrowBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`Unable to borrow item: Item is currently being borrowed by '${TestConstants.BORROWER}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH_BORROWED)
})

test('will fail to borrow batch when batch does not exist', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const api: BorrowBatch = new BorrowBatch(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BAD_REQUEST,
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`Could not find batch '${TestConstants.BAD_REQUEST}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH)
})

test('will fail to borrow batch when item name not passed in', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const api: BorrowBatch = new BorrowBatch(dbClient)

    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            borrower: TestConstants.BORROWER,
            notes: TestConstants.NOTES
        }).then(() => dbClient.getDB())
    ).rejects.toThrow("Missing required field 'name'")
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH)
})

test('will fail to borrow batch when item borrower not passed in', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.TWO_NAMES_ONE_BATCH)
    const api: BorrowBatch = new BorrowBatch(dbClient)

    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.BORROW_BATCH)

    await expect(
        api.execute({
            name: TestConstants.BATCH,
            notes: TestConstants.NOTES
        }).then(() => dbClient.getDB())
    ).rejects.toThrow("Missing required field 'borrower'")
    expect(dbClient.getDB()).toEqual(DBSeed.TWO_NAMES_ONE_BATCH)
})