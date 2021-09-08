import React from 'react';
import { Text } from 'react-native';
import { withTheme } from 'react-native-paper';
import ListElement from '../ListElement';

const DashListElement = withTheme(({ iconName, primaryText, secondaryText, color, theme }) => {
	return (
		<ListElement height={70} iconLeft={iconName} iconSize={20} iconColor={theme.colors.text}>
			{primaryText ? (
				<Text style={{ fontSize: 15, paddingBottom: 3, color: color || 'black' }}>{primaryText}</Text>
			) : (
				<></>
			)}
			{secondaryText ? (
				<Text style={{ fontSize: 12, color: 'gray' }}>{secondaryText}</Text>
			) : (
				<></>
			)}
		</ListElement>
	);
});

export default DashListElement;