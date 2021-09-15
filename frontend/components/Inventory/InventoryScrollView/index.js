import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ListDropdown from '../../ListDropdown';

const InventoryScrollView = ({
	searchQuery,
	topItemList,
	topItemComponent,
	itemList,
	itemComponent,
	itemListText,
	dropdownValues,
	sortByProperty,
}) => {
	const [dropdownValue, setDropdownValue] = useState(
		dropdownValues ? dropdownValues[0] : undefined,
	);

	const ItemComponent = itemComponent;
	const TopItemComponent = topItemComponent;

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={{ marginLeft: '5%', marginRight: '5%' }}>
				{topItemComponent && topItemList ? (
					<View style={{ marginTop: '10%' }}>
						{topItemList.map((topItem) => {
							return <TopItemComponent {...topItem} />;
						})}
					</View>
				) : (
					<></>
				)}

				{dropdownValues ? (
					<View style={styles.itemEditors}>
						<Text style={styles.itemText}>{itemListText}</Text>
						<ListDropdown
							list={dropdownValues.map((value) => ({
								label: value,
								value,
							}))}
							style={{ borderRadius: 10, width: 150 }}
							onValueChange={setDropdownValue}
						/>
					</View>
				) : (
					<View style={styles.isolatedItemsList}></View>
				)}
				{itemList
					.filter((item) => {
						if (item.searchText) {
							return item.searchText
								.replace(/ /g, '')
								.toLowerCase()
								.includes(searchQuery.replace(/ /g, '').toLowerCase());
						}
						console.warn(
							'Each item needs a searchText attribute! (Inventory component)',
						);
						return true;
					})
					.filter((item) => {
						if (item.dropdownValues) {
							return item.dropdownValues.includes(dropdownValue);
						}
						if (dropdownValues) {
							console.warn(
								'Each item needs a dropdownValues attribute! (Inventory component)',
							);
						}
						return true;
					})
					.sort((itemA, itemB) => sortAlphaNum(itemA, itemB, sortByProperty))
					.map((item) => {
						return <ItemComponent {...item} />;
					})}
			</View>
		</ScrollView>
	);
};

function sortAlphaNum(a, b, sortProperty) {
	const numericExp = /[^a-zA-Z]/g;
	const alphaExp = /[^0-9]/g;

	let sortPath = sortProperty !== undefined ? sortProperty.split('.') : [];
	let aValue = a,
		bValue = b;
	for (let i = 0; i < sortPath.length; i++) {
		aValue = aValue[sortPath[i]];
		bValue = bValue[sortPath[i]];
	}

	let aAlpha = aValue.replace(numericExp, '');
	let bAlpha = bValue.replace(numericExp, '');

	if (aAlpha === bAlpha) {
		let aNumeric = parseInt(aValue.replace(alphaExp, ''));
		let bNumeric = parseInt(bValue.replace(alphaExp, ''));
		return aNumeric === bNumeric ? 0 : aNumeric > bNumeric ? 1 : -1;
	} else {
		return aAlpha > bAlpha ? 1 : -1;
	}
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
	},
	contentContainer: {},
	itemText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	isolatedItemsList: {
		marginTop: '10%',
	},
	itemEditors: {
		borderRadius: 12,
		width: '100%',
		marginTop: '3%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 70,
	},
});

export default InventoryScrollView;
