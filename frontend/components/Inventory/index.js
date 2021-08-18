import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import { useReduxSliceProperty } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import SwipeListElement from '../SwipeListElement';
import { DeleteItem } from '../Util/UtilWrite';

const ItemListElement = ({ iconName, text, itemId }) => {
	const [deleted, setDeleted] = useState(false);

	const Swiper = ({ onButtonPress }) => {
		return (
			<SwipeListElement
				primaryText={text}
				iconLeft={iconName}
				buttonText="DELETE"
				backgroundColor={'red'}
				iconColor="black"
				onButtonPress={onButtonPress}
			/>
		);
	};

	return (
		<>
			{deleted ? (
				<>
					<View pointerEvents="none">
						<Swiper />
					</View>
				</>
			) : (
				<Swiper
					onButtonPress={() => {
						if (!deleted) {
							setDeleted(true);
							DeleteItem(itemId);
						}
					}}
				/>
			)}
		</>
	);
};

const Inventory = () => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const [searchQuery, setSearchQuery] = useState('');

	const onChangeSearch = (query) => setSearchQuery(query);

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
