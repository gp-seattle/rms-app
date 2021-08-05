import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import {Picker} from '@react-native-picker/picker'
import GroupSelector from '../GroupSelector';
import ItemTypeButton from '../ItemTypeButton';
import { TextInput } from 'react-native-paper';
import RMSToggleButton from '../RMSToggleButton';

const NewItemForm = () => {
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
				<View>
					<Text>Loctation drop down</Text>
          <Picker></Picker>
				</View>
				<Text>Quanity</Text>
			</View>
			<View style={styles.categoriesSelector}>
				<Text style={styles.categoriesText}>Catagories</Text>
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
			<View>
				<Text>Cancel Button, and Save Item button </Text>
			</View>
			<View style={{ justifyContent: 'flex-end' }}>
				<Text>Nav Bar</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	formBody: {
		// borderWidth: 2,
		// borderColor: 'black',
		marginTop: '7%',
	},
	input: {
		width: '80%',
		marginLeft: '10%',
	},
	categoriesSelector: {
		// borderWidth: 2,
		// borderColor: 'black',
		height: 200,
	},
	categoriesText: {
		fontWeight: 'bold',
		fontSize: 18,
		justifyContent: 'flex-start',
	},
});

export default NewItemForm;
