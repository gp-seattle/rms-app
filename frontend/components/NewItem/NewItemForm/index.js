import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, withTheme } from 'react-native-paper';
import ListDropdown from '../../Dashboard/ListDropdown';
import GroupSelector from '../../GroupSelector';
import QuantityBar from '../../QuantityBar';
import RMSToggleButton from '../../RMSToggleButton';

const NewItemForm = withTheme(
	forwardRef(({ onValidChange, theme }, ref) => {
		const [location, setLocation] = useState();
		const [description, setDescription] = useState();
		const [name, setName] = useState();
		const [amount, setAmount] = useState();
		const [categories, setCategories] = useState();
		const [valid, setValid] = useState();
		const locations = [
			{
				label: 'Wedgwood',
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
		// Location constant will be a slice later 

		useEffect(() => {
			if (valid === true || valid === false) {
				const categoriesValid =
					categories !== undefined &&
					Object.keys(categories).reduce((accumulator, currVal) => {
						if (typeof accumulator !== 'boolean') {
							return categories[accumulator] === true || categories[currVal] === true;
						} else {
							return accumulator === true || categories[currVal] === true;
						}
					});
				const currentlyValid =
					name &&
					description &&
					name.trim() !== '' &&
					description.trim() !== '' &&
					categoriesValid;
				if (currentlyValid && !valid) {
					setValid(true);
					onValidChange(true);
				} else if (!currentlyValid && valid) {
					setValid(false);
					onValidChange(false);
				}
			} else {
				setValid(false);
				onValidChange(false);
			}
		}, [description, name, categories]);

		function getValues() {
			let categoriesArr = [];
			Object.keys(categories).forEach((category) => {
				if (categories[category]) {
					categoriesArr.push(category);
				}
			});
			return {
				location,
				description,
				name,
				amount,
				categories: categoriesArr,
			};
		}

		useImperativeHandle(ref, () => ({
			getValues,
		}));

		return (
			<>
				<View style={styles.formBody}>
					<View>
						<TextInput
							theme={{ colors: { primary: theme.colors.primaryFiveHundred } }}
							placeholder="Name"
							mode="outlined"
							label="Name"
							style={styles.input}
							onChangeText={setName}
						/>
						<TextInput
							theme={{ colors: { primary: theme.colors.primaryFiveHundred } }}
							placeholder="Item Description"
							mode="outlined"
							label="Description"
							style={styles.input}
							onChangeText={setDescription}
						/>
						<View
							style={{
								...styles.itemEditors,
								backgroundColor: theme.colors.secondaryFifty,
							}}>
							<Text
								style={{
									...styles.itemText,
									color: theme.colors.secondaryTwoHundredText,
								}}>
								Location
							</Text>
							<ListDropdown
								list={locations}
								style={{ borderRadius: 10, width: 150, ...styles.itemDropDown }}
								onValueChange={(itemSelected) => setLocation(itemSelected)}
								dropdownStyle={{ borderRadius: 20 }}
								textStyle={{ fontSize: 14 }}
							/>
						</View>
						<View
							style={{
								...styles.itemEditors,
								backgroundColor: theme.colors.secondaryFifty,
							}}>
							<Text
								style={{
									...styles.itemText,
									color: theme.colors.secondaryTwoHundredText,
								}}>
								Amount of Items
							</Text>
							<QuantityBar
								style={{ ...styles.itemDropDown, ...styles.quantity }}
								textColor="black"
								iconColor="grey"
								textSize={20}
								min={1}
								onValueChanged={setAmount}
								increment={1}
							/>
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
								'Furniture ',
								'placeHolder#1',
								'placeHolder#2',
							]}
							ButtonComponent={RMSToggleButton}
							style={styles.group}
							buttonStyle={styles.groupButton}
							onSelectedChange={setCategories}
						/>
					</View>
				</View>
			</>
		);
	}),
);

const styles = StyleSheet.create({
	formBody: {
		marginTop: '7%',
	},
	input: {
		width: '90%',
		marginLeft: '5%',
	},
	group: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	groupButton: {
		marginTop: 7,
		marginRight: 5,
	},
	categoriesSelector: {
		height: 150,
		marginLeft: '5%',
		marginRight: '5%',
		marginTop: '3%',
		justifyContent: 'flex-start',
	},
	categoriesText: {
		fontWeight: 'bold',
		fontSize: 18,
	},
	itemEditors: {
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
	itemDropDown: {
		backgroundColor: 'white',
		borderRadius: 20,
		width: 150,
		height: '60%',
		justifyContent: 'center',
		paddingLeft: 2,
		marginTop: '3%',
	},
	itemText: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	quantity: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
});

export default NewItemForm;
