import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Button, withTheme } from 'react-native-paper';
import ListElement from '../ListElement';
// const AnimatedView = Animated.createAnimatedComponent(View);

// const renderRightActions = (progress, dragX) => {
// 	const scale = dragX.interpolate({
// 		inputRange: [-80, 0],
// 		outputRange: [1, 0],
// 		extrapolate: 'clamp',
// 	});
// 	return (
// 		<RectButton style={styles.rightAction}>
// 			<AnimatedView style={[styles.actionItems, { transform: [{ scale }] }]} />
// 		</RectButton>
// 	);
// };

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

const renderRightActions = (backgroundColor, textColor, buttonText, onButtonPress) => {
	return (
		<TouchableOpacity
			style={{ ...styles.box, backgroundColor: backgroundColor }}
			onPress={onButtonPress}>
			<Text style={{ ...styles.buttonText, color: textColor }}>{buttonText}</Text>
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
					renderRightActions(backgroundColor, textColor, buttonText, onButtonPress)
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
	rightAction: {
		width: 30,
		marginHorizontal: 10,
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'flex-end',
	},
	actionItems: {
		width: 30,
		marginHorizontal: 10,
		backgroundColor: 'plum',
		height: 20,
	},
	box: {
		backgroundColor: 'red',
		width: '25%',
		height: '100%',
		// borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
	},
});

export default SwipeListElement;
