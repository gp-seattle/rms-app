import React from 'react';
import { StyleSheet } from 'react-native';
import FabButton from '../FabButton';

const ActionButton = ({ onPress }) => {
	return <FabButton text="Hi" iconName="plus" onPress={onPress} style={styles.fab} />;
};

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		margin: 5,
		right: 0,
		bottom: 0,
	},
});

export default ActionButton;
