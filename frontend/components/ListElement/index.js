import React from 'react';
import { StyleSheet, View } from 'react-native';
import RMSIcon from '../RMSIcon';

const ListElement = ({ height, children, iconRight, iconLeft, iconSize, iconColor }) => {
	const styles = StyleSheet.create({
		container: {
			width: '100%',
			flexDirection: 'row',
			alignItems: 'center',
		},
		main: {
			height: height ? height : '70%',
			borderBottomWidth: 1,
			borderColor: '#EEE',
			justifyContent: 'center',
			flexGrow: 1,
		},
		iconLeftStyle: {
			marginRight: 30,
		},
	});
	return (
		<View style={styles.container}>
			{iconLeft && (
				<RMSIcon
					iconName={iconLeft}
					size={iconSize}
					color={iconColor}
					style={styles.iconLeftStyle}
				/>
			)}
			<View
				style={{
					...styles.main,
				}}>
				{children}
			</View>
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

export default ListElement;
