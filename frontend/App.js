import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import Toast from './components/Borrow/Toast';
import BorrowInventory from './components/BorrowInventory';
import Dashboard from './components/Dashboard/DashboardScreen';
import Inventory from './components/Inventory';
import RMSTabsNavigator from './components/Navigation/RMSTabsNavigator';
import StackNavigator from './components/Navigation/StackNavigator';
import NewItem from './components/NewItem/NewItem';
import RMSIcon from './components/RMSIcon';
import SubInventory from './components/SubInventory';
import { DynamoDBStreamInit } from './components/Util/UtilRead';
import { AmplifyInit } from './components/Util/UtilWrite';
import { useReduxSlice, useReduxSliceProperty } from './store/sliceManager';
import toastSlice from './store/slices/toastSlice';
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
				onBorrowItems={() => navigation.navigate('borrowInventory')}
			/>
			<Inventory
				name="inv"
				title="Inventory"
				iconName="format-list-bulleted"
				onSubSelected={(itemType) => {
					navigation.navigate('subInventory', { itemType });
				}}
			/>
			<View name="account" title="Account" iconName="account" />
		</RMSTabsNavigator>
	);
}

function App() {
	useEffect(() => {
		(async () => {
			await AmplifyInit();
			await DynamoDBStreamInit();
		})();
	}, []);

	return (
		<ReduxProvider store={store}>
			<PaperProvider theme={theme}>
				<Main> </Main>
			</PaperProvider>
		</ReduxProvider>
	);
}

function Main() {
	const toastState = useReduxSliceProperty(toastSlice);
	const toastInterface = useReduxSlice(toastSlice)
	return (
		<>
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
				<SubInventory name="subInventory" title="" />
				<BorrowInventory name="borrowInventory" title="Inventory" />
			</StackNavigator>
			<Toast visible={toastState.visible} iconName={toastState.iconName} onCancel={toastInterface.hide}>
				{toastState.message}
			</Toast>
		</>
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
		secondaryFifty: 'rgba(252, 190, 0, 0.25)',
		text: '#000',
	},
};

export default registerRootComponent(App);
