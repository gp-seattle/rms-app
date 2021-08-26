import React from 'react';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import itemTypeSlice from '../../../store/slices/itemTypeSlice';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';

const MainInventory = ({ onSubSelected }) => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const itemTypeState = useReduxSliceProperty(itemTypeSlice);

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
			itemList={[...itemTypeState.itemTypes]
				.map((itemType) => {
					let locations = [];

					itemsState.items.forEach((item) => {
						if (
							itemType.itemIds.includes(item.id) &&
							!locations.includes(item.location)
						) {
							locations.push(item.location);
						}
					});

					return {
						key: itemType.id,
						text: itemType.name,
						onPress: () => onSubSelected(itemType),
						searchText: itemType.name,
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
