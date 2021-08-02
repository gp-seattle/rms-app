import { Auth, Amplify } from 'aws-amplify';
import  Lambda  = require ('aws-sdk/clients/lambda')
import { TestConstants } from "../../__dev__/db/DBTestConstants"
// @ts-ignore
import awsconfig = require('../../../../../src/aws-exports')

beforeAll(() => {
})

test('will sign up when api is called', async () => {
    Amplify.configure(awsconfig)
    const { user } = await Amplify.Auth.signUp({
        username: TestConstants.USERNAME,
        password: TestConstants.PASSWORD,
        attributes: {
            email: TestConstants.EMAIl,
            name: TestConstants.OWNER
        }
    });
    console.log(user)
})