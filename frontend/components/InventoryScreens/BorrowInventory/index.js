import React from 'react';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';
import SwipePressOnceItem from '../../Inventory/Items/SwipePressOnceItem';
import { BorrowItem } from '../../Util/UtilWrite';

const MainInventory = withTheme(({ theme }) => {
	const items = useReduxSliceProperty(itemsSlice, 'items');

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
			itemComponent={SwipePressOnceItem}
			itemList={items.map((item) => {
				return {
					key: item.id,
					text: item.name,
					searchText: item.name,
					initiallyPressed: item.borrower !== '',
					buttonTextOne: 'BORROW',
					buttonTextTwo: 'BORROWED',
					buttonColorOne: theme.colors.primaryNineHundred,
					buttonColorTwo: 'gray',
					buttonTextColorOne: 'white',
					onButtonPress: () => BorrowItem(item.id),
					dropdownValues: ['All Items', item.location],
				};
			})}
			dropdownValues={locations}
			itemListText="Items"
			sortByProperty="text"
		/>
	);
});

export default MainInventory;
