import React, { useState } from 'react';
import { withTheme } from 'react-native-paper';
import SwipeListElement from '../../../SwipeListElement';

const SwipePressOnceItem = withTheme(
	({
		text,
		iconName,
		color,
		buttonTextOne,
		buttonTextTwo,
		buttonColorOne,
		buttonColorTwo,
		buttonTextColorOne,
		buttonTextColorTwo,
		onButtonPress,
		initiallyPressed,
		theme,
	}) => {
		const [pressed, setPressed] = useState(initiallyPressed);

		const Swiper = ({ buttonText, buttonColor, buttonTextColor, onButtonPress }) => {
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
						<Swiper
							buttonText={buttonTextTwo}
							buttonColor={buttonColorTwo}
							buttonTextColor={buttonTextColorTwo}
						/>
					</>
				) : (
					<Swiper
						buttonText={buttonTextOne}
						buttonColor={buttonColorOne}
						buttonTextColor={buttonTextColorOne}
						onButtonPress={() => {
							onButtonPress();
							setPressed(true);
						}}
					/>
				)}
			</>
		);
	},
);

export default SwipePressOnceItem;
