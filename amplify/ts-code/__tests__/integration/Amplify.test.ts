import { ICredentials } from '@aws-amplify/core'
import { Amplify, Auth } from 'aws-amplify'
import { InvocationResponse } from 'aws-sdk/clients/lambda'
import { TestConstants } from "../../__dev__/db/DBTestConstants"
import AWS = require('aws-sdk')
import Lambda = require( 'aws-sdk/clients/lambda')
const AWSConfig = require('../../../../src/aws-exports').default

const ENV_SUFFIX = '-alpha'
let itemId: string;

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
            await Auth.signIn({
                username: TestConstants.EMAIL,
                password: TestConstants.PASSWORD
            }).then(() => Auth.currentCredentials())
            .then((credentials: ICredentials) => credentials.authenticated)
        ).resolves.toEqual(true)
    })

    /**
     * add item using api
    */
    test('will add item when api is called', async() => {
            await expect(
                await Auth.currentCredentials()
                    .then((credentials:ICredentials) => {
                        AWS.config.credentials = credentials
                        const lambda = new Lambda({
                            credentials: credentials,
                            region: AWSConfig.aws_project_region
                        })
                        return lambda.invoke({
                            FunctionName: `AddItem${ENV_SUFFIX}`,
                            Payload: JSON.stringify({
                                name: TestConstants.DISPLAYNAME,
                                description: TestConstants.DESCRIPTION,
                                tags: [TestConstants.TAG],
                                owner: TestConstants.OWNER,
                                notes: TestConstants.NOTES
                            })
                        }).promise()
                    }).then((response: InvocationResponse) => {
                        itemId = response.Payload.toString()
                        return response.Payload.toString()
                    })
            ).resolves
    })


    /**
     * delete item using api
    */
    test('will delete item when api is called', async() => {
        await expect(
            await Auth.currentCredentials()
                .then((credentials:ICredentials) => {
                    AWS.config.credentials = credentials
                    const lambda = new Lambda({
                        credentials: credentials,
                        region: AWSConfig.aws_project_region
                    })
                    return lambda.invoke({
                        FunctionName: `DeleteItem${ENV_SUFFIX}`,
                        Payload: JSON.stringify({
                            id: itemId,
                            name: TestConstants.DISPLAYNAME,
                            description: TestConstants.DESCRIPTION,
                            tags: [TestConstants.TAG],
                            owner: TestConstants.OWNER,
                            notes: TestConstants.NOTES
                        })
                    }).promise()
                }).then((response: InvocationResponse) => {
                    return response.Payload
                })
        ).resolves.toEqual(`"Deleted a '${TestConstants.NAME}' from the inventory."`)
    })

    /**
     * AUTH: Sign Out
     */
    test('will sign out when api is called', async () => {
        await expect(
            await Auth.signOut()
                .then(() => Auth.currentCredentials())
                .then((exception: any) => exception.name)
        ).resolves.toEqual("NotAuthorizedException")
    })
});