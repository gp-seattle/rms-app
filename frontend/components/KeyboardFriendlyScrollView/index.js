import React, { useEffect, useRef } from 'react';
import { Keyboard, ScrollView, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-paper';

function KeyboardFriendlyScrollView({ children, style }) {
	const inputStatus = useRef({ waiting: false, height: undefined });
	const { height: screenHeight } = useWindowDimensions();
	const keyboardHeight = useRef(0);
	const scrollViewYOffset = useRef(0);
	const scrollViewScroll = useRef(0);
	const scrollRef = useRef();
	const inputRefs = useRef([]);

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
			keyboardHeight.current = event.endCoordinates.height;
			if (inputStatus.current.waiting) {
				let targetDistFromSV =
					(screenHeight -
						scrollViewYOffset.current -
						keyboardHeight.current -
						inputStatus.current.height) /
					2;
				let currDistFromSV = inputStatus.current.pageY - scrollViewYOffset.current;
				let output = scrollViewScroll.current + (currDistFromSV - targetDistFromSV);
				if (targetDistFromSV < 0) {
					console.error('KeyboardFriendlyScrollView: Distance between keyboard and top of ScrollView is too ' +
								  'small to display the selected text input.');
				}
				scrollRef.current.scrollTo({
					x: 0,
					y: output,
					animated: true,
				});
				inputStatus.current.waiting = false;
			}
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			Keyboard.dismiss();
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	return (
		<ScrollView
			style={style}
			ref={scrollRef}
			onLayout={({ nativeEvent: { layout } }) => (scrollViewYOffset.current = layout.y)}
			onScroll={({ nativeEvent: { contentOffset } }) =>
				(scrollViewScroll.current = contentOffset.y)
			}
			scrollEventThrottle={0}>
			{(() => {
				let refCounter = 0;
				let output = children.map((comp) => {
					if (comp.type.displayName === 'withTheme(TextInput)') {
						return (
							<TextInput
								{...comp.props}
								key={refCounter}
								ref={(ref) => {
									inputRefs.current[refCounter] = ref;
								}}
								onFocus={async () => {
									if (inputRefs.current[refCounter]) {
										let inputMeasure = await (() => {
											return new Promise((resolve) => {
												inputRefs.current[refCounter].root.measure(
													(...args) => {
														resolve({
															pageY: args[5],
															height: args[3],
														});
													},
												);
											});
										})();
										inputStatus.current = {
											waiting: true,
											pageY: inputMeasure.pageY,
											height: inputMeasure.height,
										};
									}
								}}
							/>
						);
					} else {
						return comp;
					}
				});
				return output;
			})()}
		</ScrollView>
	);
}

export default KeyboardFriendlyScrollView;
