import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

const ActionButton = withTheme((props) => {
	const styles = StyleSheet.create({
		fab: {
			position: 'absolute',
			margin: 5,
			right: 30,
			bottom: 30,
			backgroundColor: props.theme.colors.secondaryTwoHundred,
		},
	});

	return (
		<FAB
			style={styles.fab}
			icon="plus"
			onPress={props.onPress}
			color={props.theme.colors.text}
		/>
	);
});

export default withTheme(ActionButton);
