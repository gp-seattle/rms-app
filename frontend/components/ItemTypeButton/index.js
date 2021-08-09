import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import RMSIcon from '../RMSIcon';

const ItemTypeButton = withTheme(({ title, theme, onPress, style }) => {
	return (
		<TouchableOpacity
			style={{
				...styles.buttonContainer,
				backgroundColor: theme.colors.surfaceOverlay,
				...style,
			}}
			onPress={onPress}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<RMSIcon iconName="plus" size="large" color="black" focusColor="black" />
				<Text style={{ ...styles.button, color: 'black' }}>{title}</Text>
			</View>
		</TouchableOpacity>
	);
});

const styles = {
	buttonContainer: {
		borderWidth: 1,
		borderRadius: 15,
		padding: 3,
		borderColor: 'rgba(0, 0, 0, 0.2)',
	},
	button: {
		fontSize: 13,
		fontWeight: 'bold',
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 10,
		paddingRight: 10,
	},
};

export default ItemTypeButton;
