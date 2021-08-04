import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NewItemForm from './NewItemForm';
import NewItemHeader from './NewItemHeader';

const NewItem = () => {
	return (
		<View >
			<NewItemHeader />
			<NewItemForm />
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	input: {
		width: '80%',
		borderColor: 'black',
		borderWidth: 1,
		padding: 10,
	},
});

export default NewItem;
