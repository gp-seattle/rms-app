import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';

/*
  A Navigator may have all the props listed for navigators in React Navigation.
  The children of a Navigator (called Screens) may have all the props listed for screens in React Navigation.
  However, Screens must be written as an inline element, even if they have children defined elsewhere.
*/
const Navigator = (
	props = {
		children,
		initialRoute,
		screenOptions,
		headerShown,
		navigatorComponents,
	},
) => {
	const { Navigator, Screen } = props.navigatorComponents;

	const navigatorProps = { ...props };
	navigatorProps.initialRouteName =
		props.initialRoute &&
		(typeof props.initialRoute === 'string' ? props.initialRoute : props.initialRoute.name);
	if (typeof screenOptions === 'object') {
		navigatorProps.screenOptions = {
			headerShown: props.headerShown,
			...props.screenOptions,
		};
	} else {
		navigatorProps.screenOptions = props.screenOptions;
	}

	let children;
	if (props.children === undefined) {
		children = [<View name="default"></View>];
	} else if (props.children.length === undefined) {
		children = [props.children];
	} else {
		children = props.children;
	}

	const Nav = () => {
		return (
			<Navigator {...navigatorProps}>
				{children.map((child) => {
					const screenProps = {};
					screenProps.key = child.props.name || child.props.title || child.type.name;
					screenProps.name = child.props.name || child.type.name;
					const newOptions = { ...(child.props.options || {}) };
					screenProps.title = child.props.title;
					if (screenProps.title && !newOptions.title) {
						newOptions.title = screenProps.title;
					}

					return (
						<Screen options={newOptions} {...screenProps}>
							{(props) => <child.type {...props} {...child.props} />}
						</Screen>
					);
				})}
			</Navigator>
		);
	};

	return (
		<NavigationContainer independent={true}>
			<Nav />
		</NavigationContainer>
	);
};

export default Navigator;
