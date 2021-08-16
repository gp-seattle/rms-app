import { DataStore } from 'aws-amplify';

export async function GetDBData() {
	const table = await DataStore.query();
	console.log(JSON.stringify(table));
}