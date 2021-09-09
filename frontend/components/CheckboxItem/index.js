import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import RMSIcon from '../RMSIcon';

const CheckboxItem = ({
	primaryText,
	secondaryText,
	iconLeft,
	iconRight,
	iconSize,
	textColor,
	checkColor,
	disabled,
	initiallyChecked,
	onPress,
	onCheckPress,
	style,
}) => {
	const [checked, setChecked] = useState(initiallyChecked || false);

	function handleCheckPress() {
		setChecked((lastChecked) => {
			if (onCheckPress) {
				onCheckPress(!lastChecked);
			}
			return !lastChecked;
		});
	}

	return (
		<View style={{ ...styles.container, ...style, height: 70 }}>
			{iconLeft && (
				<RMSIcon
					iconName={iconLeft}
					size={iconSize}
					color={textColor}
					style={{ marginRight: 15 }}
				/>
			)}
			<TouchableOpacity style={styles.main} onPress={onPress}>
				<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
					{primaryText ? (
						<Text
							style={{ fontSize: 15, paddingBottom: 3, color: textColor || 'black' }}>
							{primaryText}
						</Text>
					) : (
						<></>
					)}
					{secondaryText ? (
						<Text style={{ fontSize: 12, color: 'gray' }}>{secondaryText}</Text>
					) : (
						<></>
					)}
				</View>
				<View style={{ justifyContent: 'center' }}>
					{iconRight && (
						<RMSIcon
							iconName={iconRight}
							size={iconSize}
							color={textColor}
							style={{ marginRight: 15 }}
						/>
					)}
				</View>
			</TouchableOpacity>
			<Checkbox.Android
				status={checked ? 'checked' : 'unchecked'}
				onPress={handleCheckPress}
				disabled={disabled}
				uncheckedColor={checkColor}
				color={checkColor}
			/>
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
		height: '100%',
		borderBottomWidth: 1,
		borderColor: '#EEE',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexGrow: 1,
	},
});

export default CheckboxItem;
