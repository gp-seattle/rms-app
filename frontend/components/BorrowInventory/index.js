import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import BorrowInventoryScrollView from './BorrowInventoryScrollView';

const BorrowInventory = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const onChangeSearch = (query) => setSearchQuery(query);

	return (
		<View style={styles.container}>
			<View style={styles.textAndSearch}>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
					style={styles.searchBar}
				/>
			</View>
			<BorrowInventoryScrollView searchQuery={searchQuery} />
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
	textAndSearch: {
		justifyContent: 'flex-start',
		marginTop: '5%',
	},
	inventoryText: {
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 30,
	},
	searchBar: { borderWidth: 1, elevation: 0, shadowOpacity: 0 },
});

export default BorrowInventory;
