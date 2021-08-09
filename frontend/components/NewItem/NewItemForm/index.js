import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, withTheme } from 'react-native-paper';
import GroupSelector from '../../GroupSelector';
import RMSToggleButton from '../../RMSToggleButton';

const NewItemForm = withTheme((props) => {
	return (
		<View style={styles.formBody}>
			<View>
				<TextInput placeholder="Name" mode="outlined" label="Name" style={styles.input} />
				<TextInput
					placeholder="Item Description"
					mode="outlined"
					label="Description"
					style={styles.input}
				/>
				<View
					style={{
						...styles.itemEditors,
						backgroundColor: props.theme.colors.secondary,
					}}>
					<Text style={styles.itemText}>Location</Text>
				</View>
				<View
					style={{
						...styles.itemEditors,
						backgroundColor: props.theme.colors.secondary,
					}}>
					<Text style={styles.itemText}>Amount of Items</Text>
				</View>
			</View>
			<View style={styles.categoriesSelector}>
				<Text style={styles.categoriesText}>Categories</Text>
				<GroupSelector
					items={[
						'Video',
						'Audio',
						'Sports',
						'Tech',
						'Ambiance',
						'Instruments',
						'Lighting',
					]}
					ButtonComponent={RMSToggleButton}
					style={{ flexWrap: 'wrap', justifyContent: 'space-around' }}
				/>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	formBody: {
		// borderWidth: 2,
		// borderColor: 'black',
		marginTop: '7%',
	},
	input: {
		width: '90%',
		marginLeft: '5%',
	},
	categoriesSelector: {
		// borderWidth: 2,
		// borderColor: 'black',
		height: 150,
		marginLeft: '5%',
    marginRight: '5%',
    marginTop: '3%'
	},
	categoriesText: {
		fontWeight: 'bold',
		fontSize: 18,
		justifyContent: 'flex-start',
	},
	itemEditors: {
		borderRadius: 12,
		width: '90%',
		marginLeft: '5%',
		padding: 20,
		marginTop: '3%',
	},
	itemText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#00b3a6',
	},
});

export default NewItemForm;