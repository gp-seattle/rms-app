import { ICredentials } from '@aws-amplify/core'
import { Amplify, Auth } from 'aws-amplify'
import { TestConstants } from "../../__dev__/db/DBTestConstants"
const AWSConfig = require('../../../../../src/aws-exports').default

// Include retries because of possiblitity of remote failures.
jest.retryTimes(3)

beforeAll(() => {
    Amplify.configure(AWSConfig)
})

/**
 * TODO: Single Use. Left here for validation purposes.
 * 
test('will sign up when api is called', async () => {
    await expect(
        Auth.signUp({
        username: TestConstants.EMAIL,
        password: TestConstants.PASSWORD,
        attributes: {
            email: TestConstants.EMAIL,
            name: TestConstants.OWNER
        }
    ).resolves
})
*/

/**
 * AUTH: Sign In
 */
test('will sign in when api is called', async () => {
    await expect(
        Auth.signIn({
            username: TestConstants.EMAIL,
            password: TestConstants.PASSWORD
        }).then(() => Auth.currentCredentials())
        .then((credentials: ICredentials) => credentials.authenticated)
    ).resolves.toEqual(true)
})

/**
 * AUTH: Sign Out
 */
test('will sign out when api is called', async () => {
    await expect(
        Auth.signOut()
        .then(() => Auth.currentCredentials())
        .then((exception: any) => exception.name)
    ).resolves.toEqual("NotAuthorizedException")
})