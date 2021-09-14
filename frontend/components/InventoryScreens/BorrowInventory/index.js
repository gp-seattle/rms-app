import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LogBox } from 'react-native';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import categorySlice from '../../../store/slices/categorySlice';
import CheckboxItem from '../../CheckboxItem';
import FabButton from '../../FabButton';
import Inventory from '../../Inventory';
import ButtonItem from '../../Inventory/Items/ButtonItem';
import { BorrowItems } from '../../Util/UtilWrite';

const BorrowInventory = ({ navigation, route }) => {
	const locations = ['All Items', 'Wedgwood', '100s', "Yeh's"];
	const topItems = [
		{ iconName: 'star', text: 'Favorite' },
		{ iconName: 'format-list-bulleted', text: 'Lists' },
	];

	const categories = useReduxSliceProperty(categorySlice, 'categories');
	const items = useReduxSliceProperty(itemsSlice, 'items');
	const itemsChecked = useRef({});
	const checkboxRefs = useRef([]);
	const fabRef = useRef();

	useEffect(() => {
		for (let i = 0; i < categories.length; i++) {
			if (itemsChecked.current[categories[i].id] === undefined) {
				itemsChecked.current[categories[i].id] = {};
				for (let j = 0; j < categories[i].itemIds.length; j++) {
					let itemId = categories[i].itemIds[j];
					itemsChecked.current[categories[i].id][itemId] = false;
				}
			}
		}
	}, []);

	useEffect(() => {
		if (route.params) {
			onNewItemsChecked();
		}
	});

	function onNewItemsChecked() {
		let itemsSelected = getIdsFromItemsChecked(itemsChecked.current).length;
		// Ignoring logs, since React tries to warn me of a memory leak, but there isn't one.
		LogBox.ignoreLogs(["it indicates a memory leak in your application"]);
		fabRef.current.setDisabled(itemsSelected === 0);
	}

	if (route.params) {
		itemsChecked.current[route.params.itemTypeId] = route.params.itemsChecked;
		for (let i = 0; i < categories.length; i++) {
			let mainItemsChecked = itemsChecked.current[categories[i].id];
			let borrowerLookup = {};
			for (let j = 0; j < items.length; j++) {
				if (categories[i].itemIds.includes(items[j].id)) {
					borrowerLookup[items[j].id] = items[j].borrower;
				}
			}
			if (mainItemsChecked) {
				let anyAvailable = true;
				let itemChecked = mainItemsChecked
					? Object.keys(mainItemsChecked).reduce((acc, curr) => {
							if (typeof acc === 'string') {
								acc = mainItemsChecked[acc] || borrowerLookup[acc] !== '';
								anyAvailable = borrowerLookup[acc] === '';
							}
							anyAvailable = anyAvailable || borrowerLookup[curr] === '';
							return acc && (mainItemsChecked[curr] || borrowerLookup[curr] !== '');
					  })
					: false;
				checkboxRefs.current[i].setChecked(itemChecked && anyAvailable);
			}
		}
		onNewItemsChecked();
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
			itemList={categories.map((category, index) => {
				const myItems = items.filter((item) => category.itemIds.includes(item.id));
				const borrowerLookup = {};
				for (let i = 0; i < myItems.length; i++) {
					if (category.itemIds.includes(myItems[i].id)) {
						borrowerLookup[myItems[i].id] = myItems[i].borrower;
					}
				}
				return {
					key: category.id,
					searchText: category.name,
					dropdownValues: ['All Items', ...new Set(myItems.map((item) => item.location))],
					primaryText: category.name,
					iconRight: 'chevron-right',
					iconSize: 20,
					textColor: 'black',
					checkColor: '#6200EE',
					ref: (ref) => (checkboxRefs.current[index] = ref),
					disabled: myItems.reduce((acc, curr) => {
						if (typeof acc === 'object') {
							acc = acc.borrower !== '';
						}
						return acc && curr.borrower !== '';
					}),
					onPress: () =>
						navigation.navigate('subBorrowInventory', {
							category,
							itemsChecked: itemsChecked.current[category.id] || false,
						}),
					onCheckPress: (checked) => {
						Object.keys(itemsChecked.current[category.id] || {}).forEach((itemId) => {
							itemsChecked.current[category.id][itemId] =
								checked && borrowerLookup[itemId] === '';
						});
						onNewItemsChecked();
					},
				};
			})}
			extraComponents={(function () {
				const BorrowFab = forwardRef(({}, ref) => {
					const [disabled, setDisabled] = useState(true);

					useImperativeHandle(ref, () => ({
						setDisabled: (value) => {
							setTimeout(() => setDisabled(value), 0);
						},
					}));

					return (
						<FabButton
							text="Borrow"
							disabled={disabled}
							onPress={() => {
								BorrowItems(getIdsFromItemsChecked(itemsChecked.current));
								navigation.navigate('mainTabs');
							}}
							style={{ position: 'absolute', bottom: 60, right: 20 }}
						/>
					);
				});

				return <BorrowFab ref={fabRef} />;
			})()}
			dropdownValues={locations}
			itemListText="Items"
			sortByProperty="primaryText"
		/>
	);
};

function getIdsFromItemsChecked(itemsChecked) {
	return Object.keys(itemsChecked).reduce((acc, curr) => {
		function itemTypeToIdList(category) {
			return Object.keys(itemsChecked[category]).filter((itemId) => {
				return itemsChecked[category][itemId];
			});
		}
		if (typeof acc !== 'object') {
			acc = itemTypeToIdList(acc);
		}
		return acc.concat(itemTypeToIdList(curr));
	});
}

export default BorrowInventory;
