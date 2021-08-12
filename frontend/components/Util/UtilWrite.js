import AWS from 'aws-sdk';
import { Amplify, Auth } from 'aws-amplify';
import { TestConstants } from '../../../amplify/ts-code/__dev__/db/DBTestConstants';

import awsconfig from '../../../src/aws-exports';

const ENV_SUFFIX = '-alpha'
const ENV_REGION = 'us-west-2'

function UtilWrite(props) {
    Amplify.configure(awsconfig);

    Auth.signIn({
        username: TestConstants.EMAIL,
        password: TestConstants.PASSWORD
    }).then(() => Auth.currentCredentials())
    .then((credentials) => credentials.authenticated);


    Auth.currentCredentials()
    .then((credentials) => {
        AWS.config.credentials = credentials
        const lambda = new AWS.Lambda({
            credentials: credentials,
            region: ENV_REGION
        })
        AddNewItem(lambda);
    });                

    const paramsAdd = {
        FunctionName: `AddItem${ENV_SUFFIX}`,
        Payload: JSON.stringify({
            id: 2,
            name: "test front-end",
            description: "pls work",
            tags: ["test1", "test2"],
            owner: "front-end team",
            notes: "test notes"
        })
    };

    const paramsDelete = {
        FunctionName: `DeleteItem${ENV_SUFFIX}`,
            Payload: JSON.stringify({
                id: '2',
                name: "test front-end",
                description: "pls work",
                tags: ["test1", "test2"],
                owner: "front-end team",
                notes: "test notes"
            })
    };

    function AddNewItem(lambda) {
        return lambda.invoke(paramsAdd, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log(data);
            }
        });
    }

    function DeleteItem(lambda) {
        return lambda.invoke(paramsDelete, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log(data);
            }
        });
    }

    Auth.signOut()
        .then(() => Auth.currentCredentials())
        .then((exception) => exception.name)
}

export default UtilWrite;