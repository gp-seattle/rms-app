import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import ActionDialog from '../../DashboardFab/ActionDialog';
import DashListElement from '../../DashListElement';
import SwipeOnceItem from '../../Inventory/Items/SwipeOnceItem';
import ListsSection from '../../ListsSection';
import RMSTitle from '../../RMSTitle';
import { ReturnItem } from '../../Util/UtilWrite';
import GroupSelection from '../GroupSelection';

const DashboardScreen = withTheme(({ onAddItem, onBorrowItems, theme }) => {
	const GROUPS = ['Gracepoint', 'A2F', 'Klesis', 'Personal'];
	const CATEGORIES = ['All', 'Other List', 'Another List'];
	const LISTS = [
		{
			id: '0',
			title: '8/22 Camping',
			isFavorite: false,
		},
		{
			id: '1',
			title: 'TFN Tech',
			isFavorite: true,
		},
		{
			id: '2',
			title: 'Music Video Filming',
			isFavorite: false,
		},
		{
			id: '3',
			title: "Jeremy's Lifegroup",
			isFavorite: false,
		},
	];

	const [groupsSelected, setGroupsSelected] = useState();
	const [categorySelected, setCategorySelected] = useState();
	const itemsInterface = useReduxSliceProperty(itemsSlice);
	const [checkedOutItems, setCheckedOutItems] = useState([]);

	function newGroupHandler(groupsSelected) {
		setGroupsSelected(groupsSelected);
	}

	function newListHandler(categorySelected) {
		setCategorySelected(categorySelected);
	}

	useEffect(() => {
		(async () => {
			const currentUser = (await Auth.currentAuthenticatedUser()).attributes.email;
			setCheckedOutItems(
				itemsInterface.items
					.filter((item) => {
						return item.borrower === currentUser;
					})
					.sort((a, b) => {
						let nameA = a.name.toUpperCase();
						let nameB = b.name.toUpperCase();
						return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
					}),
			);
		})();
	}, [itemsInterface]);

	return (
		<>
			<ScrollView style={styles.container} contentContainerStyle={styles.container}>
				<View style={styles.contentContainer}>
					<RMSTitle />
					<GroupSelection
						items={GROUPS.map((group) => group.toUpperCase())}
						onSelectedChange={newGroupHandler}
					/>
					<ListsSection
						categories={CATEGORIES}
						lists={LISTS}
						onNewSelection={newListHandler}
					/>
					<Text style={styles.title}>Checked Out</Text>
					{checkedOutItems.length === 0 ? (
						<DashListElement
							iconName="check"
							primaryText="Borrow an Item!"
							secondaryText='Use the "+" button'
							color="gray"
						/>
					) : (
						checkedOutItems.map((item) => {
							return (
								<SwipeOnceItem
									key={item.id}
									text={item.name}
									iconName="circle-small"
									buttonText="RETURN"
									buttonColor={theme.colors.primaryNineHundred}
									onButtonPress={() => ReturnItem(item.id)}
								/>
							);
						})
					)}
					<Text style={styles.title}>Reservations</Text>
					<DashListElement
						iconName="bookmark-outline"
						primaryText="Call dibs on an item!"
						secondaryText="Reserve lists or items for future use"
						color="gray"
					/>
				</View>
			</ScrollView>
			<ActionDialog onAddItem={onAddItem} onBorrowItems={onBorrowItems} />
		</>
	);
});

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	contentContainer: {
		marginBottom: 100,
	},
	title: {
		marginTop: 20,
		fontWeight: 'bold',
		fontSize: 25,
	},
});

export default DashboardScreen;
