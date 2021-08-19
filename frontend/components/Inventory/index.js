import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import SubmitBar from '../SubmitBar';
import InventoryScrollView from './InventoryScrollView';

const Inventory = (props) => {
	const [searchQuery, setSearchQuery] = useState('');
	const onChangeSearch = (query) => setSearchQuery(query);

	// using filter array for the search bar

	return (
		<View style={styles.overAllBackground}>
			<View style={styles.textAndSearch}>
				<Text style={styles.inventoryText}>Inventory</Text>
				<Searchbar
					style={styles.searchBar}
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
			</View>
			<InventoryScrollView />
			<SubmitBar
				iconName="plus"
				submitText="Add Item"
				submitDisabled={false}
				style={styles.submitBarStyle}
				onSubmit={props.onAddItem}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	overAllBackground: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
		height: '100%',
	},
	textAndSearch: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
		width: '100%',
		justifyContent: 'flex-start',
		marginTop: '20%',
	},
	inventoryText: {
		fontSize: 35,
		fontWeight: 'bold',
		marginBottom: '10%',
	},
	searchBar: { borderWidth: 1, elevation: 0, shadowOpacity: 0 },
	container: {
		paddingLeft: '1%',
		paddingRight: '3%',
		height: '100%',
	},
	submitBarStyle: { bottom: '4%' },
});

export default Inventory;
