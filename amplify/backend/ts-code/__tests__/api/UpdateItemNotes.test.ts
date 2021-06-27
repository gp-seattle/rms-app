import { UpdateItemNotes } from "../../src/api/UpdateItemNotes"
import { DBSeed, TestConstants } from "../../__dev__/db/DBTestConstants"
import { LocalDBClient } from "../../__dev__/db/LocalDBClient"

test('will update note correctly when id exists', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemNotes = new UpdateItemNotes(dbClient)
    
    await expect(
        api.execute({ 
            id: TestConstants.ITEM_ID,
            note: TestConstants.NOTES_2
        })
    ).resolves.toEqual(`Successfully updated notes about item '${TestConstants.ITEM_ID}'`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME_CHANGE_NOTE)
})

test('will throw excpetion when id is invalid', async () => {
    const dbClient: LocalDBClient = new LocalDBClient(DBSeed.ONE_NAME)
    const api: UpdateItemNotes = new UpdateItemNotes(dbClient)
    
    await expect(
        api.execute({ 
            id: TestConstants.BAD_REQUEST,
            note: TestConstants.NOTES_2
        }).then(() => dbClient.getDB())
    ).rejects.toThrow(`Couldn't find item ${TestConstants.BAD_REQUEST} in the database.`)
    expect(dbClient.getDB()).toEqual(DBSeed.ONE_NAME)
})