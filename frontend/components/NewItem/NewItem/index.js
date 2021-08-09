import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import NewItemForm from '../NewItemForm';

const NewItem = () => {
	return (
		<ScrollView  style={styles.container} contentContainerStyle={styles.container} >
			<NewItemForm />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		justifyContent: 'center',
		alignContent: 'center',
	},
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
});

export default NewItem;
