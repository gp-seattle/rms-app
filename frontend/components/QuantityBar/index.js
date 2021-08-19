import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import RMSIcon from '../RMSIcon';

const QuantityBar = ({ style, textColor, textSize, iconColor, onValueChanged, min, max }) => {
	const [value, setValue] = useState(1);
	const FONT_TO_ICON = 1.5;

	const decrement = (value) => {
		if (min !== undefined && value - 1 < parseInt(min)) {
			return value;
		}
		return value - 1;
	};
	const increment = (value) => {
		if (max !== undefined && value + 1 > parseInt(max)) {
			return value;
		}
		return value + 1;
	};
	const valueChangedHandler = (value) => {
		if (onValueChanged) {
			onValueChanged(value);
		}
	};

	useEffect(() => {
		valueChangedHandler(value);
	}, [value]);

	return (
		<View
			style={{
				...style,
				...styles.container,
			}}>
			<TouchableOpacity onPress={() => setValue((prevVal) => decrement(prevVal))}>
				<RMSIcon
					iconName="minus-circle-outline"
					color={iconColor}
					size={textSize * FONT_TO_ICON}
				/>
			</TouchableOpacity>
			<Text style={{ fontSize: textSize, color: textColor, fontWeight: 'bold' }}>
				{value}
			</Text>
			<TouchableOpacity onPress={() => setValue((prevVal) => increment(prevVal))}>
				<RMSIcon
					iconName="plus-circle-outline"
					color={iconColor}
					size={textSize * FONT_TO_ICON}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
});

export default QuantityBar;
