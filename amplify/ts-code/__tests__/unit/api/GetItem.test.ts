import { GetItem, ReturnObject } from "../../../src/api/GetItem"
import { ItemsSchema, MainSchema } from "../../../src/db/Schemas"
import { DBSeed, TestConstants, TestTimestamps } from "../../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../../__dev__/db/LocalDBClient"

test('will get item correctly when id exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME_TWO_ITEMS)
    const api: GetItem = new GetItem(dbClient)
    
    const expectedMain: MainSchema = {
        id: TestConstants.NAME,
        displayName: TestConstants.DISPLAYNAME,
        description: TestConstants.DESCRIPTION,
        tags: [TestConstants.TAG],
        items: [TestConstants.ITEM_ID, TestConstants.ITEM_ID_2],
        _version: 1,
        _lastChangedAt: 1000000000000,
        _deleted: false
    }
    const expectedItems: ItemsSchema[] = [
        {
            id: TestConstants.ITEM_ID,
            name: TestConstants.NAME,
            owner: TestConstants.OWNER,
            borrower: "",
            notes: TestConstants.NOTES,
            batch: [],
            history: [],
            schedule: [],
            _version: 1,
            _lastChangedAt: 1000000000000,
            _deleted: false
        }
    ]
    const expected: ReturnObject = new ReturnObject(expectedMain, expectedItems)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.DEFAULT)

    await expect(
        api.execute({
            key: TestConstants.ITEM_ID
        })
    ).resolves.toEqual(expected)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME_TWO_ITEMS)
})

test('will get item correctly when name exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME_TWO_ITEMS)
    const api: GetItem = new GetItem(dbClient)

    const expectedMain: MainSchema = {
        id: TestConstants.NAME,
        displayName: TestConstants.DISPLAYNAME,
        description: TestConstants.DESCRIPTION,
        tags: [TestConstants.TAG],
        items: [TestConstants.ITEM_ID, TestConstants.ITEM_ID_2],
        _version: 1,
        _lastChangedAt: 1000000000000,
        _deleted: false
    }
    const expectedItems: ItemsSchema[] = [
        {
            id: TestConstants.ITEM_ID,
            name: TestConstants.NAME,
            owner: TestConstants.OWNER,
            borrower: "",
            notes: TestConstants.NOTES,
            batch: [],
            history: [],
            schedule: [],
            _version: 1,
            _lastChangedAt: 1000000000000,
            _deleted: false
        },
        {
            id: TestConstants.ITEM_ID_2,
            name: TestConstants.NAME,
            owner: TestConstants.OWNER_2,
            borrower: "",
            notes: TestConstants.NOTES_2,
            batch: [],
            history: [],
            schedule: [],
            _version: 1,
            _lastChangedAt: 1000000000000,
            _deleted: false
        }
    ]
    const expected: ReturnObject = new ReturnObject(expectedMain, expectedItems)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.DEFAULT)

    await expect(
        api.execute({
            key: TestConstants.NAME
        })
    ).resolves.toEqual(expected)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME_TWO_ITEMS)
})

test('will throw excpetion when key is invalid', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: GetItem = new GetItem(dbClient)
    
    // Mock Date
    Date.now = jest.fn(() => TestTimestamps.DEFAULT)

    await expect(
        api.execute({
            key: TestConstants.BAD_REQUEST
        })
    ).rejects.toThrow(`Couldn't find item '${TestConstants.BAD_REQUEST}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})