import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useReduxSliceProperty } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import ListElement from '../ListElement';
import { Searchbar, Button } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { GetDBData } from '../Util/UtilRead';

const Inventory = () => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const [searchQuery, setSearchQuery] = useState('');

	const onChangeSearch = (query) => setSearchQuery(query);

	useEffect(() => {
		console.log(itemsState);
	}, [itemsState]);

	return (
		<View>
			<ScrollView ScrollView style={styles.container} contentContainerStyle={styles.container}>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
					style={{ marginTop: 50 }}
				/>
				<Button onPress={GetDBData}>Update!</Button>
				<View style={{ marginTop: 50, marginLeft: '5%' }}>
					{itemsState.items.map((item) => (
						<ListElement
							key={item.id}
							iconLeft={item.iconName}
							height={50}
							iconColor="black"
							iconSize={25}>
							<Text>{item.name}</Text>
						</ListElement>
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
	}
})

export default Inventory;