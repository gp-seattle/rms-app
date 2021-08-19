import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import SwipeListElement from '../../SwipeListElement';
import { DeleteItem } from '../../Util/UtilWrite';

const ItemSwipeElement = ({ iconName, text, itemId }) => {
	const [deleted, setDeleted] = useState(false);

	const Swiper = ({ onButtonPress }) => {
		return (
			<SwipeListElement
				primaryText={text}
				iconName={iconName}
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

const SubInventoryScrollView = ({ searchQuery, itemType }) => {
	const itemsState = useReduxSliceProperty(itemsSlice);

	return (
		<ScrollView style={styles.container}>
			<View style={{ marginLeft: '5%', marginRight: '5%' }}>
				{[...itemsState.items]
					.filter((item) =>
						item.name
							.replace(/ /g, '')
							.toLowerCase()
							.includes(searchQuery.trim().toLowerCase()),
					)
					.filter((item) => itemType.itemIds.includes(item.id))
					.sort((a, b) => {
						let nameA = a.name.toUpperCase();
						let nameB = b.name.toUpperCase();
						return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
					})
					.map((item) => (
						<ItemSwipeElement
							key={item.id}
							iconName={item.iconName}
							text={item.name}
							itemId={item.id}
						/>
					))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: '100%',
		marginTop: "5%"
	},
	itemText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
});

export default SubInventoryScrollView;
