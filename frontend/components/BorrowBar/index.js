import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';
import QuantityBar from '../QuantityBar';

const BorrowBar = withTheme(
	({
		submitText,
		onSubmit,
		iconName,
		submitStyle,
		submitDisabled,
		theme,
		style,
	}) => {
		const MIN_OPACITY = 0.25;
		const [amount, setAmount] = useState();

		return (
			<View
				style={{
					backgroundColor: theme.colors.secondaryFifty,
					...styles.container,
					...style,
				}}>
				<View style={styles.smallerContainer}>
					<Text style={{color: theme.colors.secondaryTwoHundredText, ...styles.text}}>Return items in</Text>
					<QuantityBar
						style={{ ...styles.quantity }}
						textColor="black"
						iconColor="grey"
						textSize={16}
						min={12}
						onValueChanged={setAmount}
						increment={12}
					/>
					<Text style={{color: theme.colors.secondaryTwoHundredText, ...styles.text}}>hours</Text>
				</View>
				<TouchableOpacity onPress={onSubmit} disabled={submitDisabled}>
					<FAB
						icon={iconName}
						label={submitText}
						color={theme.colors.text}
						style={{
							opacity: submitDisabled ? MIN_OPACITY : 1,
							backgroundColor: theme.colors.secondaryTwoHundred,
							...styles.fab,
							...submitStyle,
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	},
);
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '90%',
		height: 65,
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: '10%',
		borderRadius: 24,
		right: 15,
	},
	smallerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		alignContent: 'space-around',
		height: 50,
		width: 230,
		paddingLeft: '2%',
	},
	text: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	quantity: {
		backgroundColor: 'white',
		borderRadius: 12,
		// width: 75, Right now the width is flexible 
		height: '70%',
		alignItems: 'center',
		alignContent: 'space-between',
		paddingLeft: '2%',
		paddingRight: '2%',
	},
	fab: {
		borderRadius: 24,
		width: 111,
	},
});

export default BorrowBar;

//example of oh I used the BorrowBar, it will probably need more styling to look right. 
{/* <BorrowBar
				submitText="Borrow"
				cancelText="Cancel"
			/> */}

