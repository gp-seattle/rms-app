import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { withTheme } from 'react-native-paper';
import ListElement from '../ListElement';

const DashListElement = withTheme(({ iconName, primaryText, secondaryText, theme }) => {
	return (
		<ListElement height={70} iconLeft={iconName} iconSize={20} iconColor={theme.colors.text}>
			{primaryText ? (
				<Text style={{ fontSize: 15, paddingBottom: 3 }}>{primaryText}</Text>
			) : (
				<View></View>
			)}
			{secondaryText ? (
				<Text style={{ fontSize: 12, color: 'gray' }}>{secondaryText}</Text>
			) : (
				<View></View>
			)}
		</ListElement>
	);
});

const renderRightActions = (backgroundColor, textColor, fontWeight, buttonText, onButtonPress) => {
	return (
		<TouchableOpacity
			style={{ ...styles.box, backgroundColor: backgroundColor }}
			onPress={onButtonPress}>
			<Text style={{ ...styles.buttonText, color: textColor, fontWeight: fontWeight }}>
				{buttonText}
			</Text>
		</TouchableOpacity>
	);
};

const SwipeListElement = withTheme(
	({
		iconName,
		primaryText,
		secondaryText,
		theme,
		style,
		backgroundColor,
		textColor,
		fontWeight,
		buttonText,
		onButtonPress,
	}) => {
		const swipeableRef = useRef();
		return (
			<Swipeable
				ref={swipeableRef}
				style={style}
				friction={2}
				rightThreshold={40}
				renderRightActions={() =>
					renderRightActions(
						backgroundColor,
						textColor,
						fontWeight,
						buttonText,
						onButtonPress,
					)
				}
				iconColor={theme.colors.text}>
				<DashListElement
					iconName={iconName}
					primaryText={primaryText}
					secondaryText={secondaryText}
					style={{ backgroundColor: 'white' }}
				/>
			</Swipeable>
		);
	},
);

const styles = StyleSheet.create({
	box: {
		backgroundColor: 'red',
		width: '25%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
	},
});

export default SwipeListElement;
