import React from 'react';
import { View } from 'react-native';
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
		theme,
		style,
	}) => {
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
				<FAB
					icon={iconName}
					label={submitText}
					onPress={onSubmit}
					color={theme.colors.text}
					style={{
						backgroundColor: theme.colors.secondaryTwoHundred,
						borderRadius: 25,
						...submitStyle,
					}}
				/>
			</View>
		);
	},
);

export default SubmitBar;
