import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import InventoryScrollView from './InventoryScrollView';

/**
 * itemList and topItemList are lists of props given to the itemComponents and topItemComponents
 * when they are displayed.
 *
 * itemList requires the following props:
 * 		searchText: a string used as an identifier to find an item using the search bar
 * 		dropdownValues: a string array with the dropdown values where the item is allowed to show up
 */
const Inventory = ({
	headerText,
	topItemList,
	topItemComponent,
	itemList,
	itemComponent,
	itemListText,
	dropdownValues,
	sortByProperty,
	style,
	headerStyle,
	headerTextStyle,
	searchbarStyle,
	extraComponents,
}) => {
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<View style={{ ...styles.container, ...style }}>
			<View style={{ ...styles.header, ...headerStyle }}>
				{headerText ? (
					<Text style={{ ...styles.headerText, ...headerTextStyle }}>{headerText}</Text>
				) : (
					<></>
				)}
				<Searchbar
					placeholder="Search"
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={{ ...styles.searchBar, ...searchbarStyle }}
				/>
			</View>
			<InventoryScrollView
				searchQuery={searchQuery}
				topItemList={topItemList}
				topItemComponent={topItemComponent}
				itemList={itemList}
				itemComponent={itemComponent}
				itemListText={itemListText}
				dropdownValues={dropdownValues}
				sortByProperty={sortByProperty}
			/>
			{extraComponents}
			{/* <Button onPress={() => console.log("I was clicked!")}>Hi! Click me!</Button> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '5%',
		paddingRight: '5%',
		height: '100%',
	},
	header: {
		justifyContent: 'flex-start',
		marginTop: '5%',
	},
	headerText: {
		marginTop: '15%',
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 30,
	},
	searchBar: { borderWidth: 1, elevation: 0, shadowOpacity: 0 },
});

export default Inventory;
