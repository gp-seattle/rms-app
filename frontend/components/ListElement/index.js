import React from 'react';
import { StyleSheet, View } from 'react-native';
import RMSIcon from '../RMSIcon';

const ListElement = ({ paddingBottom, height, children, iconRight, iconLeft, iconSize, iconColor }) => {
	return (
		<View style={styles.container}>
			{iconLeft && (
				<RMSIcon
					iconName={iconLeft}
					size={iconSize}
					color={iconColor}
					style={{ marginRight: 30 , paddingBottom: paddingBottom ? paddingBottom : 0}}
				
				/>
			)}
			<View style={{ ...styles.main, height, paddingBottom: paddingBottom ? paddingBottom : 0}}>{children}</View>
			{iconRight && (
				<RMSIcon
					iconName={iconRight}
					size={iconSize}
					color={iconColor}
					style={{ marginLeft: 30 }}
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
