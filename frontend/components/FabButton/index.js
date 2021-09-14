import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

const FabButton = withTheme(
	({ text, onPress, iconName, textColor, backgroundColor, disabled, theme, style }) => {
		const [dimensions, setDimensions] = useState({});
		const MIN_OPACITY = 0.25;

		return (
			<TouchableOpacity
				onPress={onPress}
				disabled={disabled}
				style={{ width: dimensions.width, height: dimensions.height, ...style }}>
				<FAB
					icon={iconName}
					label={text}
					color={textColor || theme.colors.text}
					style={{
						opacity: disabled ? MIN_OPACITY : 1,
						backgroundColor: backgroundColor || theme.colors.secondaryTwoHundred,
						borderRadius: 25,
					}}
					onLayout={(event) => setDimensions(event.nativeEvent.layout)}
				/>
			</TouchableOpacity>
		);
	},
);

export default FabButton;
