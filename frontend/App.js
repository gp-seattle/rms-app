import { registerRootComponent } from 'expo';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import Dashboard from './components/Dashboard/DashboardScreen';
import RMSTabsNavigator from './components/Navigation/RMSTabsNavigator';
import StackNavigator from './components/Navigation/StackNavigator';
import NewItem from './components/NewItem/NewItem';
import RMSIcon from './components/RMSIcon';
import store from './store/store';
import Inventory from './components/Inventory';

function BackButton({ onPress }) {
	return (
		<TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
			<RMSIcon iconName="chevron-left" color="black" size={25} />
		</TouchableOpacity>
	);
}

function MainTabs({ navigation }) {
	return (
		<RMSTabsNavigator>
			<Dashboard
				name="dashboard"
				title="Dash"
				iconName="home"
				onAddItem={() => navigation.navigate('addItem')}
			/>
			<Inventory name="inv" title="Inventory" iconName="format-list-bulleted" />
			<View name="account" title="Account" iconName="account" />
		</RMSTabsNavigator>
	);
}

function App() {
	return (
		<ReduxProvider store={store}>
			<PaperProvider theme={theme}>
				<StackNavigator
					screenOptions={({ navigation }) => ({
						headerLeft: () => <BackButton onPress={navigation.goBack} />,
						headerTintColor: "black",
						headerTitleAlign: 'left',
						headerTitleStyle: {
							fontSize: 22,
							fontWeight: "bold"
						},
						headerStyle: {
							shadowColor: "transparent",
							borderBottomWidth: 0,
							elevation: 0
						}
					})}>
					<MainTabs name="mainTabs" options={{ headerShown: false }} />
					<NewItem name="addItem" title="New Item" />
				</StackNavigator>
			</PaperProvider>
		</ReduxProvider>
	);
}

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primaryFiveHundred: '#6200EE',
		primaryNineHundred: '#23036A',
		surface: '#FFF',
		surfaceMediumEmphasis: 'rgba(0, 0, 0, 0.6)',
		surfaceOverlay: 'rgba(33, 33, 33, 0.08)',
		primaryMediumEmphasis: 'rgba(255, 255, 255, 0.74)',
		secondaryTwoHundred: '#03DAC5',
		secondaryFifty: '#C8FFF4',
		text: '#000',
	},
};

export default registerRootComponent(App);