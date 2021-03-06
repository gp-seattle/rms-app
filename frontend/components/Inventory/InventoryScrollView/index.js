import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import itemTypeSlice from '../../../store/slices/itemTypeSlice';
import ListDropdown from '../../Dashboard/ListDropdown';
import ListElement from '../../ListElement';

const ItemButtonElement = ({ iconName, text, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<ListElement
				height={50}
				iconLeft={iconName}
				iconRight="chevron-right"
				iconSize={20}
				iconColor="black"
				style={{ marginBottom: 10 }}>
				<Text style={{ fontSize: 15, paddingBottom: 3 }}>{text}</Text>
			</ListElement>
		</TouchableOpacity>
	);
};

const InventoryScrollView = ({ searchQuery, onSubSelected }) => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const itemTypeState = useReduxSliceProperty(itemTypeSlice);
	const [location, setLocation] = useState('All Items');

	const locations = [
		{
			label: 'All Items',
			value: 'All Items',
		},
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

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={{ marginLeft: '5%', marginRight: '5%' }}>
				<View style={{ marginTop: '10%' }}>
					<ItemButtonElement iconName="star" text="Favorite" />
					<ItemButtonElement iconName="format-list-bulleted" text="Lists" />
					<ItemButtonElement iconName="bookmark" text="Inventory" />
				</View>

				<View style={styles.itemEditors}>
					<Text style={styles.itemText}>Items</Text>
					<ListDropdown
						list={locations}
						style={{ borderRadius: 10, width: 150 }}
						onValueChange={setLocation}
					/>
				</View>
				{[...itemTypeState.itemTypes]
					.filter((itemType) =>
						itemType.name
							.replace(/ /g, '')
							.toLowerCase()
							.includes(searchQuery.trim().toLowerCase()),
					)
					.filter((itemType) => {
						let show = false;
						if (location !== 'All Items') {
							itemsState.items.forEach((item) => {
								if (
									itemType.itemIds.includes(item.id) &&
									item.location === location
								) {
									show = true;
								}
							});
						} else {
							show = true;
						}
						return show;
					})
					.sort((a, b) => {
						let nameA = a.name.toUpperCase();
						let nameB = b.name.toUpperCase();
						return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
					})
					.map((itemType) => (
						<ItemButtonElement
							key={itemType.id}
							text={itemType.name}
							onPress={() => onSubSelected(itemType)}
						/>
					))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: '100%',
	},
	contentContainer: {},
	itemText: {
		fontSize: 25,
		fontWeight: 'bold',
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
