import React from 'react';
import { View } from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import FabButton from '../FabButton';

const SubmitBar = withTheme(
	({
		cancelText,
		submitText,
		onCancel,
		onSubmit,
		iconName,
		cancelStyle,
		submitDisabled,
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
					color={theme.colors.primaryFiveHundred}
					style={{ ...cancelStyle }}>
					{cancelText}
				</Button>
				<FabButton
					text={submitText}
					iconName={iconName}
					onPress={onSubmit}
					disabled={submitDisabled}
				/>
			</View>
		);
	},
);

export default SubmitBar;
