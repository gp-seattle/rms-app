import { ICredentials } from '@aws-amplify/core'
import { Amplify, Auth } from 'aws-amplify'
import { InvocationResponse } from 'aws-sdk/clients/lambda'
import { TestConstants } from "../../__dev__/db/DBTestConstants"
import AWS = require('aws-sdk')
import Lambda = require( 'aws-sdk/clients/lambda')
const AWSConfig = require('../../../../../src/aws-exports').default

const ENV_SUFFIX = '-alpha'

describe('Amplify Tests', () => {
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

    test('will add item when api is called', async() => {
            await expect(
                Auth.currentCredentials()
                    .then((credentials:ICredentials) => {
                        console.log(credentials)
                        AWS.config.credentials = credentials
                        const lambda = new Lambda({
                            credentials:credentials,
                            region: "us-west-2"
                        })
                        return lambda.invoke({
                            FunctionName: `AddItem${ENV_SUFFIX}`,
                            Payload: JSON.stringify({
                                id: TestConstants.ITEM_ID,
                                name: TestConstants.DISPLAYNAME,
                                description: TestConstants.DESCRIPTION,
                                tags: [TestConstants.TAG],
                                owner: TestConstants.OWNER,
                                notes: TestConstants.NOTES
                            })
                        }).promise()
                    }).then((response: InvocationResponse) => {
                        console.log(response)
                        return response.Payload
                    })
            ).resolves.toEqual(`Created Item with RMS ID: ${TestConstants.ITEM_ID}`)
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
});