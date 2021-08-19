const DynamoDBStream = require('dynamodb-stream');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBStreams } = require('@aws-sdk/client-dynamodb-streams');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
import { Auth } from 'aws-amplify';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { getReduxSlice } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import itemTypeSlice from '../../store/slices/itemTypeSlice';
import store from '../../store/store';
import { DeleteItem } from './UtilWrite';

const itemsInterface = getReduxSlice(store, itemsSlice);
const itemTypesInterface = getReduxSlice(store, itemTypeSlice);

const ENV_SUFFIX = '-alpha';
const ENV_REGION = 'us-west-2';

export async function DynamoDBStreamInit() {
	const credentials = await Auth.currentCredentials();
	AWS.config.credentials = credentials;
	const ddb = new DynamoDB({
		region: ENV_REGION,
		credentials: credentials,
	});

	const itemsTableInfo = await ddb.describeTable({ TableName: 'items' + ENV_SUFFIX });
	const mainTableInfo = await ddb.describeTable({ TableName: 'main' + ENV_SUFFIX });

	const itemsStream = new DynamoDBStream(
		new DynamoDBStreams({
			region: ENV_REGION,
			credentials: credentials,
		}),
		itemsTableInfo.Table.LatestStreamArn,
		unmarshall,
	);
	const mainStream = new DynamoDBStream(
		new DynamoDBStreams({
			region: ENV_REGION,
			credentials: credentials,
		}),
		mainTableInfo.Table.LatestStreamArn,
		unmarshall,
	);

	await itemsStream.fetchStreamState();
	await mainStream.fetchStreamState();

	const { Items } = await ddb.scan({ TableName: 'items' + ENV_SUFFIX });
	const { Items: MainItems } = await ddb.scan({ TableName: 'main' + ENV_SUFFIX });

	//JUST FOR DEBUG
	// Items.map(unmarshall).forEach(async (item) => {
	// 	await DeleteItem(item.id);
	// });

	await translateToRedux('items init', Items.map(unmarshall));
	await translateToRedux('main init', MainItems.map(unmarshall));

	const watchStream = () => {
		setTimeout(async () => {
			await itemsStream.fetchStreamState();
			await mainStream.fetchStreamState();
			watchStream();
		}, 10 * 1000);
	};
	watchStream();

	itemsStream.on('insert record', (data, keys) => {
		translateToRedux('items insert', data);
	});
	itemsStream.on('remove record', (data, keys) => {
		translateToRedux('items remove', keys);
	});
	itemsStream.on('modify record', (newData, oldData, keys) => {
		translateToRedux('items modify', {
			newData,
			keys,
		});
	});

	mainStream.on('insert record', (data, keys) => {
		translateToRedux('main insert', data);
	});
	mainStream.on('remove record', (data, keys) => {
		translateToRedux('main remove', keys);
	});
	mainStream.on('modify record', (newData, oldData, keys) => {
		translateToRedux('main modify', {
			newData,
			keys,
		});
	});
}

async function translateToRedux(action, data) {
	if (action.includes('init')) {
		const allItems = data;
		for (let i = 0; i < allItems.length; i++) {
			if (action === 'items init') {
				const notes = JSON.parse(allItems[i].notes);
				itemsInterface.addItem(
					allItems[i].id,
					notes.displayName,
					notes.description || '',
					allItems[i].owner.split('/_')[1],
					allItems[i].borrower,
				);
			} else if (action === 'main init') {
				itemTypesInterface.addItemType(
					allItems[i].id,
					allItems[i].displayName,
					allItems[i].description,
					allItems[i].tags,
					allItems[i].items,
				);
			}
		}
		console.log('Done initing!');
	} else if (action.includes('insert')) {
		const item = data;
		if (action === 'items insert') {
			const notes = JSON.parse(item.notes);
			const ownerArr = item.owner.split('/_');
			itemsInterface.addItem(
				item.id,
				notes.displayName,
				notes.description || item.description,
				ownerArr[1],
				item.borrower,
			);
		} else if (action === 'main insert') {
			itemTypesInterface.addItemType(
				item.id,
				item.displayName,
				item.description,
				item.tags,
				item.items,
			);
		}
	} else if (action.includes('remove')) {
		if (action === 'items remove') {
			itemsInterface.removeItem(data.id);
		} else if (action === 'main remove') {
			itemTypesInterface.removeItemType(data.id);
		}
	} else if (action.includes('modify')) {
		const item = data.newData;
		const id = data.keys.id;
		if (action === 'items remove') {
			itemsInterface.modifyItem(id, item);
		} else if (action === 'main remove') {
			itemTypesInterface.modifyItemType(id, item);
		}
	}
}
