import React, { useEffect } from 'react';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import Inventory from '../../Inventory';
import SwipeOnceItem from '../../Inventory/Items/SwipeOnceItem';
import { DeleteItem } from '../../Util/UtilWrite';

const SubInventory = ({ route, navigation }) => {
	const items = useReduxSliceProperty(itemsSlice, 'items');

	useEffect(() => {
		navigation.setOptions({ title: route.params.itemType.name });
	}, []);

	return (
		<Inventory
			itemComponent={SwipeOnceItem}
			itemList={[...items]
				.filter((item) => route.params.itemType.itemIds.includes(item.id))
				.map((item) => {
					return {
						key: item.id,
						text: item.name,
						searchText: item.name,
						buttonText: 'DELETE',
						buttonColor: 'red',
						buttonTextColor: 'white',
						isSinglePress: true,
						onButtonPress: () => DeleteItem(item.id),
					};
				})}
			sortByProperty="text"
		/>
	);
};

export default SubInventory;
