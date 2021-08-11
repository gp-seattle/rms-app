import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SubmitBar from '../../SubmitBar';
import NewItemForm from '../NewItemForm';

const NewItem = ({ navigation }) => {
	return (
		<View>
			<ScrollView style={styles.container} contentContainerStyle={styles.container}>
				<NewItemForm />
			</ScrollView>
			<SubmitBar onCancel={navigation.goBack} iconName="plus" submitText="Save Item" cancelText="Cancel"></SubmitBar>
		</View>
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
		height: '100%',
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
});

export default NewItem;
