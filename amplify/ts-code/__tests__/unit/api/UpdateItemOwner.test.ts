import { UpdateItemOwner } from "../../../src/api/UpdateItemOwner"
import { DBSeed, TestConstants } from "../../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../../__dev__/db/LocalDBClient"

test('will update description correctly when id exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)
    
    await expect(
        api.execute({
            id: TestConstants.ITEM_ID,
            currentOwner: TestConstants.OWNER,
            newOwner: TestConstants.OWNER_2
        })
    ).resolves.toEqual(`Successfully updated owner for item '${TestConstants.ITEM_ID}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME_CHANGE_OWNER)
})

test('will throw excpetion when owner is invalid', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)
    
    await expect(
        api.execute({
            id: TestConstants.ITEM_ID,
            currentOwner: TestConstants.BAD_REQUEST,
            newOwner: TestConstants.OWNER_2
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`'owner' is currently '${TestConstants.OWNER}', which isn't equal to the expected value of '${TestConstants.BAD_REQUEST}'.`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})

test('will throw excpetion when id is invalid', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)
    
    await expect(
        api.execute({
            id: TestConstants.BAD_REQUEST,
            currentOwner: TestConstants.OWNER,
            newOwner: TestConstants.OWNER_2
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`Couldn't find item ${TestConstants.BAD_REQUEST} in the database.`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})

test('will fail to update item owner when id not passed in', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)

    await expect(
        api.execute({
            currentOwner: TestConstants.OWNER,
            newOwner: TestConstants.OWNER_2
        })
    ).rejects.toThrow("Missing required field 'id'")
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})

test('will fail to update item owner when item currentOwner not passed in', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)

    await expect(
        api.execute({
            id: TestConstants.ITEM_ID,
            newOwner: TestConstants.OWNER_2
        })
    ).rejects.toThrow("Missing required field 'currentOwner'")
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})

test('will fail to update item owner when item newOwner not passed in', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemOwner = new UpdateItemOwner(dbClient)

    await expect(
        api.execute({
            id: TestConstants.ITEM_ID,
            currentOwner: TestConstants.OWNER,
        })
    ).rejects.toThrow("Missing required field 'newOwner'")
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})