import React, { useState } from 'react';
import { View } from 'react-native';
import { withTheme } from 'react-native-paper';
import SwipeListElement from '../../../SwipeListElement';

const SwipeOnceItem = withTheme(({
	text,
	iconName,
	color,
	buttonText,
	buttonColor,
	buttonTextColor,
	onButtonPress,
	theme
}) => {
	const [pressed, setPressed] = useState(false);

	const Swiper = ({ onButtonPress }) => {
		return (
			<SwipeListElement
				primaryText={text}
				textColor={buttonTextColor || theme.colors.surface}
				iconName={iconName}
				iconColor={color || theme.colors.surface}
				buttonText={buttonText}
				backgroundColor={buttonColor}
				onButtonPress={onButtonPress}
			/>
		);
	};

	return (
		<>
			{pressed ? (
				<>
					<View pointerEvents="none">
						<Swiper />
					</View>
				</>
			) : (
				<Swiper
					onButtonPress={() => {
						onButtonPress();
						setPressed(true);
					}}
				/>
			)}
		</>
	);
});

export default SwipeOnceItem;
