import React from 'react';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import categorySlice from '../../../store/slices/categorySlice';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';

const MainInventory = ({ onSubSelected }) => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const categories = useReduxSliceProperty(categorySlice, "categories");

	const locations = ['All Items', 'Wedgwood', '100s', "Yeh's"];
	const topItems = [
		{ iconName: 'star', text: 'Favorite' },
		{ iconName: 'format-list-bulleted', text: 'Lists' },
		{ iconName: 'bookmark', text: 'Inventory' },
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
			itemComponent={ButtonItem}
			itemList={[...categories]
				.map((category) => {
					let locations = [];

					itemsState.items.forEach((item) => {
						if (
							category.itemIds.includes(item.id) &&
							!locations.includes(item.location)
						) {
							locations.push(item.location);
						}
					});

					return {
						key: category.id,
						text: category.name,
						onPress: () => onSubSelected(category),
						searchText: category.name,
						dropdownValues: ['All Items', ...locations],
					};
				})}
			dropdownValues={locations}
			headerText="Inventory"
			itemListText="Items"
			sortByProperty="text"
		/>
	);
};

export default MainInventory;
