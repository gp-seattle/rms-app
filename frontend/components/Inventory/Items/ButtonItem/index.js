import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import ListElement from '../../../ListElement';

const ButtonItem = ({ iconName, text, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<ListElement
				height={50}
				iconLeft={iconName}
				iconRight="chevron-right"
				iconSize={20}
				iconColor="black"
				style={{ marginBottom: 10 }}>
				<Text style={{ fontSize: 15, paddingBottom: 3 }}>{text}</Text>
			</ListElement>
		</TouchableOpacity>
	);
};

export default ButtonItem;