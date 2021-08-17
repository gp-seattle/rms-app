import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import Dashboard from './components/Dashboard/DashboardScreen';
import RMSTabsNavigator from './components/Navigation/RMSTabsNavigator';
import StackNavigator from './components/Navigation/StackNavigator';
import store from './store/store';
import NewItem from './components/NewItem/NewItem';
import RMSIcon from './components/RMSIcon';

import BorrowFAB from './components/Borrow/BorrowFAB';
import BorrowToast from './components/Borrow/BorrowToast';

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
			<View name="inv" title="Inventory" iconName="format-list-bulleted" />
			<View name="info" title="Info" iconName="alert-circle" />
		</RMSTabsNavigator>
	);
}

function App() {
	const [visible, setVisible] = useState(false);

	return (
		<View style = {styles.screen}>
			<BorrowFAB onPress = {() => setVisible(true)} />
				<BorrowToast 
					visible = {visible} 
					onCancel = {() => setVisible(false)} 
				/>
		</View>

		//<ReduxProvider store={store}>
		//	<PaperProvider theme={theme}>
		//		<StackNavigator
		//			screenOptions={({ navigation }) => ({
		//				headerLeft: () => <BackButton onPress={navigation.goBack} />,
		//				headerTintColor: 'black',
		//				headerTitleAlign: 'left',
		//				headerTitleStyle: {
		//					fontSize: 22,
		//					fontWeight: 'bold',
		//				},
		//				headerStyle: {
		//					shadowColor: 'transparent',
		//					borderBottomWidth: 0,
		//					elevation: 0,
		//				},
		//			})}>
		//			<MainTabs name="mainTabs" options={{ headerShown: false }} />
		//			<NewItem name="addItem" title="New Item" />
		//		</StackNavigator>
		//	</PaperProvider>
		//</ReduxProvider>
	);
}

const styles = StyleSheet.create({
	screen: {
        width: '100%',
        height: '100%'
	}
});

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
