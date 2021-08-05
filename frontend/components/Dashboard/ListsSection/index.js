import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListGroup from '../ListGroup';

const ListsSection = ({ categories, lists, onNewSelection }) => {
	const [categorySelected, setCategorySelected] = useState(categories[0]);

	useEffect(() => {
		if (onNewSelection) {
			onNewSelection(categorySelected);
		}
	}, [categorySelected]);

	return (
		<View>
			<View style={styles.section}>
				<Text style={styles.title}>Lists</Text>
				<Picker
					selectedValue={categorySelected}
					style={{ height: 50, width: 150 }}
					mode="dropdown"
					onValueChange={(category) => setCategorySelected(category)}>
					{categories.map((category) => {
						return <Picker.Item label={category} value={category} key={category} />;
					})}
				</Picker>
			</View>
			<ListGroup lists={lists} spaceBetween={10} />
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 25,
	},
});

export default ListsSection;
