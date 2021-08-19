import React from 'react';
import { StyleSheet, View } from 'react-native';
import RMSIcon from '../RMSIcon';

const ListElement = ({ style, height, children, iconRight, iconLeft, iconSize, iconColor }) => {
	return (
		<View style={{...styles.container, ...style, height}}>
			{iconLeft && (
				<RMSIcon
					iconName={iconLeft}
					size={iconSize}
					color={iconColor}
					style={{ marginRight: 15 }}
				/>
			)}
			<View style={{ ...styles.main }}>{children}</View>
			{iconRight && (
				<RMSIcon
					iconName={iconRight}
					size={iconSize}
					color={iconColor}
					style={{ marginLeft: 15 }}
				/>
			)}
		</View>
	);
};

export default ListElement;
