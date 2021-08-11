import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { withTheme } from 'react-native-paper';

const RMSToggleButton = withTheme(({ title, theme, onPress, style }) => {
	let [toggled, setToggled] = useState(false);

	return (
		<TouchableOpacity
			style={{
				...styles.buttonContainer,
				backgroundColor: toggled ? theme.colors.primaryFiveHundred : theme.colors.surface,
<<<<<<< HEAD
				...style,
=======
				...style
>>>>>>> 9447aec (Initial Redux work)
			}}
			onPress={() => {
				setToggled((lastState) => !lastState);
				if (onPress) {
					onPress();
				}
			}}>
			{toggled ? (
				<Text style={{ ...styles.button, color: theme.colors.surface }}>{title}</Text>
			) : (
<<<<<<< HEAD
				<Text style={{ ...styles.button, color: theme.colors.primaryFiveHundred }}>
					{title}
				</Text>
=======
				<Text style={{ ...styles.button, color: theme.colors.primaryFiveHundred }}>{title}</Text>
>>>>>>> 9447aec (Initial Redux work)
			)}
		</TouchableOpacity>
	);
});

const styles = {
	buttonContainer: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 3,
		borderColor: 'rgba(0, 0, 0, 0.2)',
	},
	button: {
		fontSize: 13,
		fontWeight: 'bold',
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 10,
		paddingRight: 10,
	},
};

export default RMSToggleButton;
