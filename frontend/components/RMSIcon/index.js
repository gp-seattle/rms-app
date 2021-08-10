import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withTheme } from 'react-native-paper';

const RMSIcon = ({ iconName, focused, size, color, focusColor, style, theme }) => {
	return focused ? (
		<MaterialCommunityIcons
			name={iconName}
			color={focusColor || theme.colors.surface}
			size={size}
			style={{ ...style }}
		/>
	) : (
		<MaterialCommunityIcons
			name={iconName}
			color={color || theme.colors.primaryMediumEmphasis}
			size={size}
			style={{ ...style }}
		/>
	);
};

export default withTheme(RMSIcon);
