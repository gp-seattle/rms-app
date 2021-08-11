import AWS from 'aws-sdk';
import { Amplify, Auth } from 'aws-amplify';
import { TestConstants } from '../../../amplify/ts-code/__dev__/db/DBTestConstants';

const ENV_SUFFIX = '-alpha'
const ENV_REGION = 'us-west-2'

function UtilWrite(props) {
    Auth.signIn({
        username: TestConstants.EMAIL,
        password: TestConstants.PASSWORD
    }).then(() => Auth.currentCredentials())
    .then((credentials) => credentials.authenticated)

    Auth.currentCredentials()
    .then((credentials) => {
        AWS.config.credentials = credentials
        const lambda = new AWS.Lambda({
            credentials: credentials,
            region: ENV_REGION
        })
        AddNewItem(lamdba);
    });                

    var params = {
        FunctionName: `AddItem${ENV_SUFFIX}`,
        Payload: JSON.stringify({
            id: 2,
            name: "test front-end",
            description: "pls work",
            tags: ["test1", "test2"],
            owner: "annie",
            notes: "test notes"
        })
    };

    function AddNewItem(lambda) {
        return lambda.invoke(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log(data);
            }
        });
    }

    function DeleteItem() {
        lambda.invoke({
            FunctionName: `DeleteItem${ENV_SUFFIX}`,
            Payload: JSON.stringify({
                id: props.id,
                name: props.name,
                description: props.description,
                tags: [props.tags],
                owner: props.owner,
                notes: props.notes
            })
        });
    }

    Auth.signOut()
        .then(() => Auth.currentCredentials())
        .then((exception) => exception.name)
}

export default UtilWrite;