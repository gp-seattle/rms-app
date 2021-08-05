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
		justifyContent: 'center',
		alignContent: 'center',
	},
});

export default NewItem;
