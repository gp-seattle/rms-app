import AWS from 'aws-sdk';

const ENV_SUFFIX = '-alpha'
const ENV_REGION = 'us-west-2'

function UtilWrite(props) {
    const lambda = new AWS.Lambda({
        acessKeyId: 'test',
        secretAccessKey: 'test',
        region: ENV_REGION
    })
    console.log("lambda", lambda);

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
    console.log("params", params);

    function AddItem() {
        return lambda.invoke(params, function(err, data) {
            console.log('running!');
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log(data);
            }
        }).promise();
    }

    AddItem();

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
}

export default UtilWrite;