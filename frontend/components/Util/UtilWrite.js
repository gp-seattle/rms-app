import { Amplify, Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { TestConstants } from '../../../amplify/ts-code/__dev__/db/DBTestConstants';
import awsconfig from '../../../src/aws-exports';

const ENV_SUFFIX = '-alpha';
const ENV_REGION = 'us-west-2';

async function urlOpener(url, redirectUrl) {
	const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

	if (type === 'success' && Platform.OS === 'ios') {
		WebBrowser.dismissBrowser();
		return Linking.openURL(newUrl);
	}
}

export async function AddNewItem(name, description, location, amount, categories) {
	for (let i = 0; i < amount; i++) {
		let currentCategories = categories;
		if (i !== 0) {
			currentCategories = [];
		}
		await AddOneItem(name, name + ' #' + (i + 1), description, location, currentCategories);
	}
}

async function AddOneItem(mainItemName, itemName, description, location, categories) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	const user = currentUser.replace(/\/_/g, '');
	const loc = location.replace(/\/_/g, '');
	const owner = user + '/_' + loc;
	await invoke({
		FunctionName: `AddItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			name: mainItemName,
			description,
			tags: categories,
			owner,
			notes: JSON.stringify({
				displayName: itemName,
			}),
		}),
	}).Payload;
}

export async function DeleteItem(id) {
	await invoke({
		FunctionName: `DeleteItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			id,
		}),
	});
}

export async function BorrowItem(id) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	await invoke({
		FunctionName: `BorrowItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			ids: [id],
			borrower: currentUser,
		}),
	});
}

export async function ReturnItem(id) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	await invoke({
		FunctionName: `ReturnItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			ids: [id],
			borrower: currentUser,
			notes: TestConstants.NOTES,
		}),
	});
}

export async function AmplifyInit() {
	Amplify.configure({
		...awsconfig,
		oauth: {
			...awsconfig.oauth,
			urlOpener,
		},
	});
	await Auth.signIn({
		username: TestConstants.EMAIL,
		password: TestConstants.PASSWORD,
	});
	return await Auth.currentCredentials();
}

async function close() {
	await Auth.signOut();
	try {
		await Auth.currentCredentials();
	} catch (e) {
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
		} else {
			resultData = data;
		}
	});
	return resultData;
}
