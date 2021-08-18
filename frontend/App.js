import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { DynamoDBStreamInit } from './components/Util/UtilRead';
import Dashboard from './components/Dashboard/DashboardScreen';
import Inventory from './components/Inventory';
import RMSTabsNavigator from './components/Navigation/RMSTabsNavigator';
import StackNavigator from './components/Navigation/StackNavigator';
import NewItem from './components/NewItem/NewItem';
import RMSIcon from './components/RMSIcon';
import { AmplifyInit, DeleteItem } from './components/Util/UtilWrite';
import store from './store/store';

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
	useEffect(() => {
		(async () => {
			await AmplifyInit();
			await DynamoDBStreamInit();
			// const { Main, Items, Batch, Tags, History, Schedule } = initSchema(schema);
			// await DataStore.start();
		})();
	}, []);

	return (
		<ReduxProvider store={store}>
			<PaperProvider theme={theme}>
				<StackNavigator
					screenOptions={({ navigation }) => ({
						headerLeft: () => <BackButton onPress={navigation.goBack} />,
						headerTintColor: 'black',
						headerTitleAlign: 'left',
						headerTitleStyle: {
							fontSize: 22,
							fontWeight: 'bold',
						},
						headerStyle: {
							shadowColor: 'transparent',
							borderBottomWidth: 0,
							elevation: 0,
						},
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
		primaryFiveHundred: '#07A0C3',
		primaryNineHundred: '#005C6F',
		surface: '#FFF',
		surfaceMediumEmphasis: 'rgba(0, 0, 0, 0.6)',
		surfaceOverlay: 'rgba(33, 33, 33, 0.08)',
		primaryMediumEmphasis: 'rgba(255, 255, 255, 0.74)',
		secondaryTwoHundred: '#FCBE00',
		secondaryFifty: '#C8FFF4',
		text: '#000',
	},
};

export default registerRootComponent(App);