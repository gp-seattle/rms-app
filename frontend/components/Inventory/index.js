import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Searchbar } from 'react-native-paper';
import { useReduxSliceProperty } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import SwipeListElement from '../SwipeListElement';
import { GetDBData } from '../Util/UtilRead';
import { DeleteItem } from '../Util/UtilWrite';

const ItemListElement = ({ iconName, text, itemId }) => {
	const [deleted, setDeleted] = useState(false);

	return (
		<SwipeListElement
			primaryText={text}
			iconLeft={iconName}
			buttonText="DELETE"
			backgroundColor={deleted ? "gray" : "red"}
			iconColor="black"
			onButtonPress={() => {
				if (!deleted) {
					console.log("Yay");
					setDeleted(true);
					DeleteItem(itemId);
				}
			}}
		/>
	);
};

const Inventory = () => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const [searchQuery, setSearchQuery] = useState('');

	const onChangeSearch = (query) => setSearchQuery(query);

	useEffect(() => {
		console.log(itemsState);
	}, [itemsState]);

	return (
		<View>
			<ScrollView
				ScrollView
				style={styles.container}
				contentContainerStyle={styles.container}>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
					style={{ marginTop: 50 }}
				/>
				<Button onPress={GetDBData}>Update!</Button>
				<View style={{ marginTop: 50, marginLeft: '5%' }}>
					{itemsState.items.map((item) => (
						<ItemListElement
							key={item.id}
							iconName={item.iconName}
							text={item.name}
							itemId={item.id}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
		height: '100%',
	},
});

export default Inventory;
