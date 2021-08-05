import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withTheme } from 'react-native-paper';

const RMSIcon = ({ iconName, focused, size, theme }) => {
	return focused ? (
		<MaterialCommunityIcons name={iconName} color={theme.colors.surface} size={size} />
	) : (
		<MaterialCommunityIcons
			name={iconName}
			color={theme.colors.primaryMediumEmphasis}
			size={size}
		/>
	);
};

export default withTheme(RMSIcon);
