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

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	main: {
    height: "100%",
		borderBottomWidth: 1,
		borderColor: '#EEE',
		justifyContent: 'center',
		flexGrow: 1,
	},
});

export default ListElement;
