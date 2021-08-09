import React from 'react';
import { Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import GroupSelector from '../../GroupSelector';
import RMSToggleButton from '../../RMSToggleButton';

const GroupSelection = withTheme(({ items, onSelectedChange, theme }) => {
	return (
		<View>
			<Text style={{ color: theme.colors.surfaceMediumEmphasis }}>Group</Text>
			<GroupSelector
				items={items}
				onSelectedChange={onSelectedChange}
				ButtonComponent={RMSToggleButton}
			/>
		</View>
	);
});

export default GroupSelection;