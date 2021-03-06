import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import InventoryScrollView from './InventoryScrollView';

const Inventory = ({ onSubSelected }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const onChangeSearch = (query) => setSearchQuery(query);

	return (
		<View style={styles.container}>
			<View style={styles.textAndSearch}>
				<Text style={styles.inventoryText}>Inventory</Text>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
					style={styles.searchBar}
				/>
			</View>
			<InventoryScrollView searchQuery={searchQuery} onSubSelected={onSubSelected} />
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
		marginTop: '20%',
	},
	inventoryText: {
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 30,
	},
	searchBar: { borderWidth: 1, elevation: 0, shadowOpacity: 0 },
});

export default Inventory;
