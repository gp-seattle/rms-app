import React from 'react';
import { Text, View } from 'react-native';
import { useReduxSliceProperty } from '../../store/sliceManager';
import itemsSlice from '../../store/slices/itemsSlice';
import ListElement from '../ListElement';

const Inventory = () => {
  const itemsState = useReduxSliceProperty(itemsSlice);

	return (
		<View style={{marginTop: 50, marginLeft: "5%"}}>
			{itemsState.items.map((item) => (
				<ListElement key={item.id} iconLeft={item.iconName} height={50} iconColor="black" iconSize={25}>
					<Text>{item.name}</Text>
				</ListElement>
			))}
		</View>
	);
};

export default Inventory;
