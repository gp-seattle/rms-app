const DynamoDBStream = require('dynamodb-stream');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBStreams } = require('@aws-sdk/client-dynamodb-streams');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Auth } from 'aws-amplify';
import { getReduxSlice } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import store from '../../store/store';
import { DeleteItem } from './UtilWrite';

const itemsInterface = getReduxSlice(store, itemsSlice);

const ENV_SUFFIX = '-alpha';
const ENV_REGION = 'us-west-2';

const TABLE_NAME = 'items' + ENV_SUFFIX;

export async function DynamoDBStreamInit() {
	const credentials = await Auth.currentCredentials();
	AWS.config.credentials = credentials;
	const ddb = new DynamoDB({
		region: ENV_REGION,
		credentials: credentials,
	});
	const tableInfo = await ddb.describeTable({ TableName: TABLE_NAME });
	const ddbStream = new DynamoDBStream(
		new DynamoDBStreams({
			region: ENV_REGION,
			credentials: credentials,
		}),
		tableInfo.Table.LatestStreamArn,
		unmarshall,
	);

	const localState = new Map();
	await ddbStream.fetchStreamState();
	const { Items } = await ddb.scan({ TableName: TABLE_NAME });
	Items.map(unmarshall).forEach((item) => localState.set(item.id, item));

	//JUST FOR DEBUG
	// Items.map(unmarshall).forEach(async (item) => {
	// 	await DeleteItem(item.id);
	// });

	await translateToRedux('init', Items.map(unmarshall));

	// parse results and store in local state
	const watchStream = () => {
		setTimeout(() => ddbStream.fetchStreamState().then(watchStream), 10 * 1000);
	};
	watchStream();

	ddbStream.on('insert record', (data, keys) => {
		translateToRedux("insert", data);
	});

	ddbStream.on('remove record', (data, keys) => {
		translateToRedux("remove", keys);
	});

	ddbStream.on('modify record', (newData, oldData, keys) => {
		translateToRedux("modify", {
			data: newData,
			keys
		});
	});
}

async function translateToRedux(action, data) {
	if (action === 'init') {
		const allItems = data;
		for (let i = 0; i < allItems.length; i++) {
			const notes = JSON.parse(allItems[i].notes);
			itemsInterface.addLocalItem(
				allItems[i].id,
				notes.capsName,
				notes.description,
				notes.location,
				notes.amount,
				notes.categories,
			);
		}
		console.log('Done initing!');
	} else if (action === 'insert') {
		console.log("Insert! Data = ", data);
		const item = data;
		const notes = JSON.parse(item.notes);
		itemsInterface.addLocalItem(
			item.id,
			notes.capsName,
			notes.description,
			notes.location,
			notes.amount,
			notes.categories,
		);
	} else if(action === 'remove') {
		console.log("Remove! Data = ", data);
		itemsInterface.removeLocalItem(
			data.id,
		);
	}
}
