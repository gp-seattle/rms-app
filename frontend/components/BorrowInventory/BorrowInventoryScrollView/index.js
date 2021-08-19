import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import ListDropdown from '../../Dashboard/ListDropdown';
import ListElement from '../../ListElement';
import SwipeListElement from '../../SwipeListElement';
import { BorrowItem } from '../../Util/UtilWrite';

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

const BorrowSwipeElement = withTheme(({ iconName, text, itemId, initiallyBorrowed, theme }) => {
	const [borrowed, setBorrowed] = useState(initiallyBorrowed);

	const Swiper = ({ onButtonPress, backgroundColor, buttonText }) => {
		return (
			<SwipeListElement
				primaryText={text}
				iconName={iconName}
				buttonText={buttonText}
				backgroundColor={backgroundColor}
				textColor={theme.colors.surface}
				iconColor="black"
				onButtonPress={onButtonPress}
			/>
		);
	};

	return (
		<>
			{borrowed ? (
				<>
					<Swiper backgroundColor="gray" buttonText="BORROWED" />
				</>
			) : (
				<Swiper
					backgroundColor={theme.colors.primaryNineHundred}
					buttonText="BORROW"
					onButtonPress={() => {
						if (!borrowed) {
							setBorrowed(true);
							BorrowItem(itemId);
						}
					}}
				/>
			)}
		</>
	);
});

const BorrowInventoryScrollView = ({ searchQuery, onSubSelected }) => {
	const itemsState = useReduxSliceProperty(itemsSlice);
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
				</View>

				<View style={styles.itemEditors}>
					<Text style={styles.itemText}>Items</Text>
					<ListDropdown
						list={locations}
						style={{ borderRadius: 10, width: 150 }}
						onValueChange={setLocation}
					/>
				</View>
				{[...itemsState.items]
					.filter((item) =>
						item.name
							.replace(/ /g, '')
							.toLowerCase()
							.includes(searchQuery.trim().toLowerCase()),
					)
					.filter((item) => location === 'All Items' || item.location === location)
					.sort((a, b) => {
						let nameA = a.name.toUpperCase();
						let nameB = b.name.toUpperCase();
						return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
					})
					.map((item) => (
						<BorrowSwipeElement
							key={item.id}
							text={item.name}
							itemId={item.id}
							initiallyBorrowed={item.borrower !== ''}
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

export default BorrowInventoryScrollView;
