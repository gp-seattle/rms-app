import React, { useRef } from 'react';
import { withTheme } from 'react-native-paper';
import RMSIcon from '../../RMSIcon';
import TabsNavigator from '../TabsNavigator';

const RMSTabsNavigator = ({ children, theme }) => {
	const latestId = useRef(0);

	let isChildren = true;
	if (children === undefined) {
		isChildren = false;
		children = [<View name="default"></View>];
	} else if (children.length === undefined) {
		children = [children];
	} else {
		children = children;
	}

	return (
		<TabsNavigator
			screenOptions={{
				headerShown: false,
				activeColor: theme.colors.surface,
				inactiveColor: theme.colors.primaryMediumEmphasis,
			}}
			barStyle={{
				backgroundColor: theme.colors.primaryFiveHundred,
			}}>
			{!isChildren
				? children
				: children.map((child) => {
						return (
							<child.type
								key={latestId.current++}
								options={{
									tabBarLabel: child.props.title,
									tabBarIcon: ({ focused, size }) => {
										return (
											<RMSIcon
												iconName={child.props.iconName}
												focused={focused}
												size={size || 20}
											/>
										);
									},
								}}
								{...child.props}
							/>
						);
				  })}
		</TabsNavigator>
	);
};

export default withTheme(RMSTabsNavigator);
