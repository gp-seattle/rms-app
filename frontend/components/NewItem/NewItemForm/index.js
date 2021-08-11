import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, withTheme } from 'react-native-paper';
import ListDropdown from '../../Dashboard/ListDropdown';
import GroupSelector from '../../GroupSelector';
import QuantityBar from '../../QuantityBar';
import RMSToggleButton from '../../RMSToggleButton';

const NewItemForm = withTheme((props) => {
	const [location, setLocation] = useState();
	const [description, setDescription] = useState();
	const [name, setName] = useState();
	const [amount, setAmount] = useState();
	const [categories, setCategories] = useState();
	const locations = [
		{
			label: 'Wedgewood',
			value: 'Wedgwood',
		},
		{
			label: '100s',
			value: '100s',
		},
		{
			label: "Yeh's",
			value: "Yeh's",
		},
	];
	return (
		<>
			<View style={styles.formBody}>
				<View>
					<TextInput
						placeholder="Name"
						mode="outlined"
						label="Name"
						style={styles.input}
						onChangeText={setName}
					/>
					<TextInput
						placeholder="Item Description"
						mode="outlined"
						label="Description"
						style={styles.input}
						onChangeText={setDescription}
					/>
					<View
						style={{
							...styles.item.editors,
							backgroundColor: props.theme.colors.secondaryFifty,
						}}>
						<Text style={styles.item.text}>Location</Text>
						<ListDropdown
							list={locations}
							style={{ borderRadius: 10, width: 150, ...styles.item.dropDown }}
							onValueChange={(itemSelected) => setLocation(itemSelected)}
							dropdownStyle={{ borderRadius: 20 }}
							textStyle={{ fontSize: 14 }}
						/>
					</View>
					<View
						style={{
							...styles.item.editors,
							backgroundColor: props.theme.colors.secondaryFifty,
						}}>
						<Text style={styles.item.text}>Amount of Items</Text>
						<QuantityBar
							style={{ ...styles.item.dropDown, ...styles.quantity }}
							textColor="black"
							iconColor="grey"
							textSize={20}
							min={1}
							onValueChanged={setAmount}
						/>
					</View>
				</View>
				<View style={styles.categories.selector}>
					<Text style={styles.categories.text}>Categories</Text>
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
						buttonStyle={{ marginTop: 7 }}
						onSelectedChange={setCategories}
					/>
				</View>
			</View>
		</>
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
		backgroundColor: 'white',
	},
	categories: {
		selector: {
			// borderWidth: 2,
			// borderColor: 'black',
			height: 150,
			marginLeft: '5%',
			marginRight: '5%',
			marginTop: '3%',
			justifyContent: 'space-evenly',
		},
		text: {
			fontWeight: 'bold',
			fontSize: 18,
		},
	},
	item: {
		editors: {
			borderRadius: 12,
			width: '90%',
			marginLeft: '5%',
			paddingLeft: '3%',
			paddingRight: '3%',
			marginTop: '3%',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: 70,
		},
		dropDown: {
			backgroundColor: 'white',
			borderRadius: 20,
			width: 150,
			height: '60%',
			justifyContent: 'center',
			paddingLeft: 2,
			marginTop: '3%',
		},
		text: {
			fontSize: 12,
			fontWeight: 'bold',
			color: '#00b3a6',
		},
	},
	quantity: {
		alignItems: 'center',
	},
});

export default NewItemForm;
