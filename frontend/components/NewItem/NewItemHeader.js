import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const NewItemHeader = ({ onBackPress, onCancelPress }) => {
	return (
		<View style={styles.headerBox}>
			<View style={styles.newItem}>
				<Text onPress={onBackPress} style={styles.backArrow}>
					{' <'}{' '}
				</Text>
				<Text style={styles.text}>New Item</Text>
			</View>
			<View style={styles.button}>
				<Button title="cancel" onPress={onCancelPress} color="purple" />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerBox: {
		// borderWidth: 2,
		// borderColor: 'blue',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '90%',
		marginLeft: '5%',
		marginTop: '15%',
	},
	newItem: {
		// borderWidth: 2,
		// borderColor: 'red',
		flexDirection: 'row',
	},
	text: {
		// borderWidth: 2,
		// borderColor: 'gold',
		// color: 'green',
		fontWeight: 'bold',
		marginLeft: '5%',
		fontSize: 20,
	},
	button: {
		// borderWidth: 2,
		// borderColor: 'purple',
	},
	backArrow: {
		// borderWidth: 1,
		// borderColor: 'pink',
		width: 20,
		fontWeight: 'bold',
	},
});
export default NewItemHeader;
