import { GetItem } from "../../src/api/GetItem"
import { MainSchema } from "../../src/db/Schemas"
import { DBSeed, TestConstants } from "../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../__dev__/db/LocalDBClient"

test('will get item correctly when id exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME_TWO_ITEMS)
    const api: GetItem = new GetItem(dbClient)
    
    const expected: MainSchema = {
        name: TestConstants.NAME,
        description: TestConstants.DESCRIPTION,
        tags: dbClient.createSet([TestConstants.TAG]),
        items: { }
    }
    expected.items[TestConstants.ITEM_ID] = {
        owner: TestConstants.OWNER,
        borrower: "",
        notes: TestConstants.NOTES,
    }
    
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
    
    const expected: MainSchema = {
        name: TestConstants.NAME,
        description: TestConstants.DESCRIPTION,
        tags: dbClient.createSet([TestConstants.TAG]),
        items: { }
    }
    expected.items[TestConstants.ITEM_ID] = {
        owner: TestConstants.OWNER,
        borrower: "",
        notes: TestConstants.NOTES,
    }
    expected.items[TestConstants.ITEM_ID_2] = {
        owner: TestConstants.OWNER_2,
        borrower: "",
        notes: TestConstants.NOTES_2,
    }
    
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
    
    await expect(
        api.execute({ 
            key: TestConstants.BAD_REQUEST
        })
    ).rejects.toThrow(`Couldn't find item '${TestConstants.BAD_REQUEST}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})