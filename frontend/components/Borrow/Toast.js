import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Snackbar, withTheme } from 'react-native-paper';
import RMSIcon from '../RMSIcon';

const Toast = withTheme(({ visible, onCancel, children, iconName, theme }) => {
	return (
		<Snackbar style={styles.toast} visible={visible} onDismiss={onCancel} duration={2021}>
			<View style={styles.view}>
				<Text style={styles.text}> {children} </Text>
				<RMSIcon iconName={iconName} color={theme.colors.text} size={20}></RMSIcon>
			</View>
		</Snackbar>
	);
});

const styles = StyleSheet.create({
	toast: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		width: '40%',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		bottom: 50,
	},
	view: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		width: '100%',
		height: "100%",
	},
	text: {
		color: 'black',
	},
});

export default Toast;
