import { Amplify, Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { TestConstants } from '../../../amplify/ts-code/__dev__/db/DBTestConstants';
import awsconfig from '../../../src/aws-exports';
import { getReduxSlice } from '../../store/sliceManager';
import toastSlice from '../../store/slices/toastSlice';
import store from '../../store/store';

const ENV_SUFFIX = '-alpha';
const ENV_REGION = 'us-west-2';
const toastInterface = getReduxSlice(store, toastSlice);

async function urlOpener(url, redirectUrl) {
	const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

	if (type === 'success' && Platform.OS === 'ios') {
		WebBrowser.dismissBrowser();
		return Linking.openURL(newUrl);
	}
}

export async function AddNewItem(name, description, location, amount, categories) {
	let success = true;
	for (let i = 0; i < amount; i++) {
		let currentCategories = categories;
		if (i !== 0) {
			currentCategories = [];
		}
		success =
			(await AddOneItem(
				name,
				name + ' #' + (i + 1),
				description,
				location,
				currentCategories,
			)) && success;
	}
	if (success) {
		toastInterface.show('Items Added', 'plus');
	}
}

async function AddOneItem(mainItemName, itemName, description, location, categories) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	const user = currentUser.replace(/\/_/g, '');
	const loc = location.replace(/\/_/g, '');
	const owner = user + '/_' + loc;
	const result = await queryableInvoke({
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
	});
	if (!result.resolved) {
		console.error(result.result);
	}
	return result.resolved;
}

export async function DeleteItem(id) {
	const result = await queryableInvoke({
		FunctionName: `DeleteItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			id,
		}),
	});
	if (result.resolved) {
		toastInterface.show('Item Deleted', 'trash-can-outline');
	} else {
		console.error(result.result);
	}
}

export async function BorrowItem(id) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	const result = await queryableInvoke({
		FunctionName: `BorrowItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			ids: [id],
			borrower: currentUser,
		}),
	});
	if (result.resolved) {
		toastInterface.show('Item Borrowed', 'check');
	} else {
		console.error(result.result);
	}
}

export async function ReturnItem(id) {
	const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
	const result = await queryableInvoke({
		FunctionName: `ReturnItem${ENV_SUFFIX}`,
		Payload: JSON.stringify({
			ids: [id],
			borrower: currentUser,
			notes: TestConstants.NOTES,
		}),
	});
	if (result.resolved) {
		toastInterface.show('Item Returned', 'check');
	} else {
		console.error(result.result);
	}
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

function queryableInvoke(params) {
	return new Promise((resolve) => {
		invoke(params)
			.then((result) => {
				resolve({
					result,
					resolved: true,
				});
			})
			.catch((error) => {
				resolve({
					result: error,
					resolved: false,
				});
			});
	});
}

function invoke(params) {
	return new Promise(async (resolve, reject) => {
		const credentials = await Auth.currentCredentials();
		AWS.config.credentials = credentials;
		const lambda = new AWS.Lambda({
			credentials: credentials,
			region: ENV_REGION,
		});
		lambda.invoke(params, function (data, err) {
			if (err && err.StatusCode !== 200) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
