import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, withTheme } from 'react-native-paper';

const ModalButton = withTheme(({ onPress, onModalClose, icon, theme, children }) => {
	return (
		<TouchableOpacity style={styles.button}>
			<Button
				mode="contained"
				color={theme.colors.primary}
				icon={icon}
				contentStyle={{ flexDirection: "row-reverse" }}
				onPress={() => {
					if (onPress) {
						onPress();
						if (onModalClose) {
							onModalClose();
						}
					}
				}}>
				{children}
			</Button>
		</TouchableOpacity>
	);
});

function ActionModal({ visible, onCreateList, onAddItem, onCancel }) {
	return (
		<Modal transparent={true} visible={visible} animationType="slide">
			<Pressable style={styles.modalContainer} onPress={onCancel}></Pressable>
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<ModalButton onPress={onCreateList} onModalClose={onCancel} icon="plus">
						Create List
					</ModalButton>
					<ModalButton onPress={onAddItem} onModalClose={onCancel} icon="plus">
						Add New Item
					</ModalButton>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	container: {
		backgroundColor: '#23036A',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '30%',
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
	},
	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginTop: 20,
		width: '80%',
		height: '60%',
	},
	button: {
		width: '100%',
	},
});

export default withTheme(ActionModal);
