import React, { useRef, useEffect } from 'react';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import itemTypeSlice from '../../../store/slices/itemTypeSlice';
import CheckboxItem from '../../CheckboxItem';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';

const BorrowInventory = withTheme(({ navigation, route, theme }) => {
	const itemTypes = useReduxSliceProperty(itemTypeSlice, 'itemTypes');
	const items = useReduxSliceProperty(itemsSlice, 'items');
	const itemsChecked = useRef({});

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
	}, [itemTypes]);

	if (route.params) {
		itemsChecked.current[route.params.itemTypeId] = route.params.itemsChecked;
	}

	const locations = ['All Items', 'Wedgwood', '100s', "Yeh's"];
	const topItems = [
		{ iconName: 'star', text: 'Favorite' },
		{ iconName: 'format-list-bulleted', text: 'Lists' },
	];

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
			itemList={itemTypes.map((itemType) => {
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
					disabled: myItems.reduce((acc, curr) => {
						if (typeof acc === 'object') {
							acc = acc.borrower !== '';
						}
						return acc && curr.borrower !== '';
					}),
					onPress: () =>
						navigation.navigate('subBorrowInventory', {
							itemType,
							itemsChecked: itemsChecked.current[itemType.id],
						}),
					onCheckPress: (checked) => {
						Object.keys(itemsChecked.current[itemType.id]).forEach((itemId) => {
							itemsChecked.current[itemType.id][itemId] = checked;
						});
						console.log(itemsChecked.current);
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
