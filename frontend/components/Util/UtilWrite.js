import AWS from 'aws-sdk';
import { Amplify, Auth } from 'aws-amplify';
import { TestConstants } from '../../../amplify/ts-code/__dev__/db/DBTestConstants';

import awsconfig from '../../../src/aws-exports';

const ENV_SUFFIX = '-alpha';
const ENV_REGION = 'us-west-2';

export async function AddNewItem(name, description, tags, owner, notes) {
	let resultId = await invoke({
		FunctionName: `AddItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			name,
			description,
			tags,
			owner,
			notes
		}),
	}).Payload;
	return resultId.substring(1, resultId.length - 1);
}

export async function DeleteItem(id) {
	await invoke({
		FunctionName: `DeleteItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			id,
		}),
	});
}

export async function AmplifyInit() {
	Amplify.configure(awsconfig);
	await Auth.signIn({
		username: TestConstants.EMAIL,
		password: TestConstants.PASSWORD,
	});
	return await Auth.currentCredentials();
}

async function close() {
	await Auth.signOut()
	try {
		await Auth.currentCredentials();
	} catch(e) {
		console.error(e);
	}
}

async function invoke(params) {
	const credentials = await Auth.currentCredentials();
	AWS.config.credentials = credentials;
	const lambda = new AWS.Lambda({
		credentials: credentials,
		region: ENV_REGION,
	});
	let resultData;
	lambda.invoke(params, function (data, err) {
		if (err) {
			console.log(err, err.stack);
		}else{
			resultData = data;
		}
	});
	return resultData;
}
