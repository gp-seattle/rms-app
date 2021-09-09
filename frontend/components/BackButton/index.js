import React from 'react';
import { TouchableOpacity } from 'react-native';
import RMSIcon from '../RMSIcon';

function BackButton({ onPress }) {
	return (
		<TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
			<RMSIcon iconName="chevron-left" color="black" size={25} />
		</TouchableOpacity>
	);
}

export default BackButton;