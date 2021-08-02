import { Auth } from 'aws-amplify';
import  Lambda  = require ('aws-sdk/clients/lambda')
import { TestConstants } from "../../__dev__/db/DBTestConstants"

test('will sign up when api is called', async () => {
    try {
        const { user } = await Auth.signUp({
            username: TestConstants.USERNAME,
            password: TestConstants.PASSWORD,
            attributes: {
                email: TestConstants.EMAIl,
                name: TestConstants.OWNER
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
})