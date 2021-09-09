import React, { useEffect, useRef } from 'react';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import BackButton from '../../BackButton';
import CheckboxItem from '../../CheckboxItem';
import Inventory from '../../Inventory';

const SubBorrowInventory = withTheme(({ route, navigation, theme }) => {
	const items = useReduxSliceProperty(itemsSlice, 'items');
	const itemsChecked = useRef({});

	const locations = ['All Items', 'Wedgwood', '100s', "Yeh's"];
	const { itemType } = route.params;

	useEffect(() => {
		navigation.setOptions({
			title: itemType.name,
			headerLeft: () => <BackButton onPress={goBack} />,
		});
	}, []);

	if (route.params) {
		itemsChecked.current = route.params.itemsChecked;
	}

	function goBack() {
		navigation.navigate('borrowInventory', {
			itemTypeId: itemType.id,
			itemsChecked: itemsChecked.current,
		});
	}

	return (
		<Inventory
			itemComponent={CheckboxItem}
			itemList={items
				.filter((item) => itemType.itemIds.includes(item.id))
				.map((item) => {
					return {
						key: item.id,
						searchText: item.name,
						dropdownValues: ['All Items', item.location],
						primaryText: item.name,
						secondaryText: item.location,
						textColor: 'black',
						checkColor: '#6200EE',
						disabled: item.borrower !== '',
						initiallyChecked: item.borrower === '' && itemsChecked.current[item.id],
						onCheckPress: (checked) => {
							let output = { ...itemsChecked.current };
							output[item.id] = checked;
							itemsChecked.current = output;
						},
					};
				})}
			dropdownValues={locations}
			itemListText=""
			sortByProperty="primaryText"
		/>
	);
});

export default SubBorrowInventory;
