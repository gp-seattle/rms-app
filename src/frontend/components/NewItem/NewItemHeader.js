import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

const NewItemHeader = ({ onBackPress, title, onCancelPress }) => {
	return (
		<View style={styles.headerContainer}>
			<View style={styles.newItem}>
				<Text onPress={onBackPress} style={styles.backArrow}>
					{' <'}{' '}
				</Text>
				<Text style={styles.text}>New Item</Text>
			</View>
			<View style={styles.button}>
				<Button title="cancel" onPress={onCancelPress} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		borderWidth: 2,
		borderColor: 'black',
		alignItems: 'center',
		flexDirection: 'row',
		height: 150,
		justifyContent: 'space-between',
	},
	newItem: {
		flexDirection: 'row',
	},
	backArrow: {
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'flex-start',
		width: 20,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	button: {
		borderColor: 'black',
		borderWidth: 1,
		justifyContent: 'flex-end',
	},
});

export default NewItemHeader;
