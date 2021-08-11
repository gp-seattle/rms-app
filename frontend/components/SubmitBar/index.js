import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button, FAB, withTheme } from 'react-native-paper';

const SubmitBar = withTheme(
	({
		cancelText,
		submitText,
		onCancel,
		onSubmit,
		iconName,
		submitStyle,
		cancelStyle,
		submitDisabled,
		theme,
		style,
	}) => {
		const MIN_OPACITY = 0.25;

		return (
			<View
				style={{
					flexDirection: 'row',
					width: '65%',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'absolute',
					bottom: '10%',
					right: '5%',
					...style,
				}}>
				<Button
					mode="text"
					onPress={onCancel}
					style={{ color: theme.colors.primaryFiveHundred, ...cancelStyle }}>
					{cancelText}
				</Button>
				<TouchableOpacity onPress={onSubmit} disabled={submitDisabled}>
					<FAB
						icon={iconName}
						label={submitText}
						color={theme.colors.text}
						style={{
							opacity: submitDisabled ? MIN_OPACITY : 1,
							backgroundColor: theme.colors.secondaryTwoHundred,
							borderRadius: 25,
							...submitStyle,
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	},
);

export default SubmitBar;
