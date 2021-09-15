import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListGroup from '../Dashboard/ListGroup';
import ListDropdown from '../ListDropdown';

const ListsSection = ({ categories, lists, onNewSelection }) => {
	const [categorySelected, setCategorySelected] = useState(categories[0]);

	const dropdownList = categories.map((categoryStr) => ({
		label: categoryStr,
		value: categoryStr.toLowerCase().trim(),
	}));

	return (
		<View>
			<View style={styles.section}>
				<Text style={styles.title}>Lists</Text>
				<ListDropdown
					list={dropdownList}
					style={{ borderRadius: 10, width: 150 }}
					onValueChange={(value) => {
						if(onNewSelection) {
							onNewSelection(value);
						}
						setCategorySelected(value);
					}}
				/>
			</View>
			<ListGroup lists={lists} spaceBetween={10} />
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 25,
	},
});

export default ListsSection;
