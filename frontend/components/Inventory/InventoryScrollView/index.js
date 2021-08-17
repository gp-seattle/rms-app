import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useReduxSliceProperty } from '../../../store/sliceManager';
import ListElement from '../../ListElement';
import itemsSlice from '../../../store/slices/itemsSlice';
import { ScrollView } from 'react-native-gesture-handler';
import ListDropdown from '../../Dashboard/ListDropdown';
import RMSIcon from '../../RMSIcon';

const InventoryScrollView = () => {
	const itemsState = useReduxSliceProperty(itemsSlice);
	const locations = [
		{
			label: 'All Items',
			value: 'All Items',
		},
		{
			label: 'Wedgewood',
			value: 'Wedgwood',
		},
		{
			label: '100s',
			value: '100s',
		},
		{
			label: "Yeh's",
			value: "Yeh's",
		},
	];
	return (
		<ScrollView ScrollView style={styles.container} contentContainerStyle={styles.container}>
			<View style={{ marginLeft: '5%' }}>
				
				<View style={styles.itemEditors}>
					<Text style={styles.itemText}>Items</Text>
					<ListDropdown list={locations} />
				</View>

				<ListElement iconLeft="star" iconColor="black" iconSize="25">
					<Text style={{fontSize: 30}}>Favorite</Text>			
					<RMSIcon iconName='right-chevron' size={30} theme='black'/>
				</ListElement>
				
				<ListElement iconLeft="format-list-bulleted" iconColor="black" iconSize="25">
					<Text style={{fontSize: 30}}>lists</Text>					
				</ListElement>
				
				<ListElement iconLeft="bookmark" iconColor="black" iconSize="25">
					<Text style={{fontSize: 30}}>lists</Text>					
				</ListElement>
				
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
	);
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: '1%',
		paddingRight: '3%',
		height: '100%',
	},
	itemText: {
		fontSize: 27,
		fontWeight: '500',
	},
	itemEditors: {
		borderRadius: 12,
		width: '100%',
		paddingLeft: '3%',
		paddingRight: '3%',
		marginTop: '3%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 70,
	},
});

export default InventoryScrollView;
