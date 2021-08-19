import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { EasingNode } from 'react-native-reanimated';
import ActionButton from '../ActionButton';
import ActionModal from '../ActionModal';

function ActionDialog({ onCreateList, onAddItem, onBorrowItems }) {
	const MAX_OPACITY = 0.5;

	const [visible, setVisible] = useState(false);
	const dimEffect = useRef(new Animated.Value(0)).current;

	function dimIn() {
		Animated.timing(dimEffect, {
			toValue: MAX_OPACITY,
			easing: EasingNode.ease,
			duration: 200,
		}).start();
	}

	function dimOut() {
		Animated.timing(dimEffect, {
			toValue: 0,
			easing: EasingNode.ease,
			duration: 200,
		}).start();
	}

	return (
		<>
			<Animated.View
				pointerEvents="none"
				style={{ ...styles.dimContainer, opacity: dimEffect }}></Animated.View>
			<ActionButton
				onPress={() => {
					setVisible(true);
					dimIn();
				}}
			/>
			<ActionModal
				visible={visible}
				onCancel={() => {
					setVisible(false);
					dimOut();
				}}
				onCreateList={onCreateList}
				onAddItem={onAddItem}
				onBorrowItems={onBorrowItems}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	dimContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
	},
});

export default ActionDialog;
