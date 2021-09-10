import React, { useRef, useEffect, useState } from 'react';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import itemTypeSlice from '../../../store/slices/itemTypeSlice';
import CheckboxItem from '../../CheckboxItem';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';

const BorrowInventory = withTheme(({ navigation, route, theme }) => {
	const locations = ['All Items', 'Wedgwood', '100s', "Yeh's"];
	const topItems = [
		{ iconName: 'star', text: 'Favorite' },
		{ iconName: 'format-list-bulleted', text: 'Lists' },
	];

	const itemTypes = useReduxSliceProperty(itemTypeSlice, 'itemTypes');
	const items = useReduxSliceProperty(itemsSlice, 'items');
	const itemsChecked = useRef({});
	const checkboxRefs = useRef([]);

	useEffect(() => {
		for (let i = 0; i < itemTypes.length; i++) {
			if (itemsChecked.current[itemTypes[i].id] === undefined) {
				itemsChecked.current[itemTypes[i].id] = {};
				for (let j = 0; j < itemTypes[i].itemIds.length; j++) {
					let itemId = itemTypes[i].itemIds[j];
					itemsChecked.current[itemTypes[i].id][itemId] = false;
				}
			}
		}
	}, []);

	if (route.params) {
		itemsChecked.current[route.params.itemTypeId] = route.params.itemsChecked;
		for (let i = 0; i < itemTypes.length; i++) {
			let mainItemsChecked = itemsChecked.current[itemTypes[i].id];
			let borrowerLookup = {};
			for(let j = 0; j < items.length; j++) {
				if(itemTypes[i].itemIds.includes(items[j].id)) {
					borrowerLookup[items[j].id] = items[j].borrower;
				}
			}
			if (mainItemsChecked) {
				let itemChecked = mainItemsChecked
					? Object.keys(mainItemsChecked).reduce((acc, curr) => {
							if (typeof acc === 'string') {
								acc = mainItemsChecked[acc] || borrowerLookup[acc].trim() !== '';
							}
							return (
								acc && (mainItemsChecked[curr] || borrowerLookup[curr].trim() !== '')
							);
					  })
					: false;
				checkboxRefs.current[i].setChecked(itemChecked);
			}
		}
	}

	return (
		<Inventory
			topItemComponent={ButtonItem}
			topItemList={topItems.map((topItem) => ({
				iconName: topItem.iconName,
				key: topItem.text,
				text: topItem.text,
				searchText: topItem.text,
			}))}
			itemComponent={CheckboxItem}
			itemList={itemTypes.map((itemType, index) => {
				const myItems = items.filter((item) => itemType.itemIds.includes(item.id));
				return {
					key: itemType.id,
					searchText: itemType.name,
					dropdownValues: ['All Items', ...new Set(myItems.map((item) => item.location))],
					primaryText: itemType.name,
					iconRight: 'chevron-right',
					iconSize: 20,
					textColor: 'black',
					checkColor: '#6200EE',
					ref: (el) => (checkboxRefs.current[index] = el),
					disabled: myItems.reduce((acc, curr) => {
						if (typeof acc === 'object') {
							acc = acc.borrower.trim() !== '';
						}
						return acc && curr.borrower.trim() !== '';
					}),
					onPress: () =>
						navigation.navigate('subBorrowInventory', {
							itemType,
							itemsChecked: itemsChecked.current[itemType.id] || false,
						}),
					onCheckPress: (checked) => {
						Object.keys(itemsChecked.current[itemType.id] || {}).forEach((itemId) => {
							itemsChecked.current[itemType.id][itemId] = checked;
						});
					},
				};
			})}
			dropdownValues={locations}
			itemListText="Items"
			sortByProperty="primaryText"
		/>
	);
});

export default BorrowInventory;
