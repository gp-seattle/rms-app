import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

const ActionButton = withTheme(({ onPress, theme }) => {
  const submitText = "Hi";
  const iconName = "plus";
	return (
		<FAB
			icon={iconName}
			label={submitText}
			color={theme.colors.text}
      onPress={onPress}
			style={{
				opacity: submitDisabled ? MIN_OPACITY : 1,
				backgroundColor: theme.colors.secondaryTwoHundred,
				borderRadius: 25,
				...submitStyle,
			}}
		/>
	);
});

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		margin: 5,
		right: 0,
		bottom: 0,
	},
});

export default ActionButton;
