import React from 'react';
import { registerRootComponent } from 'expo';
import { Provider as ReduxProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import store from './store/store';
import Dashboard from './components/Dashboard';
import RMSTabsNavigator from './components/Navigation/RMSTabsNavigator';
import { View } from 'react-native';



function App() {
	return (
		<ReduxProvider store={store}>
			<PaperProvider theme={theme}>
				<RMSTabsNavigator>
          <Dashboard iconName="home" label="Dash" />
          <View name="inv" title="Inventory" iconName="format-list-bulleted" />
          <View name="info" title="Info" iconName="alert-circle" />
        </RMSTabsNavigator>
			</PaperProvider>
		</ReduxProvider>
	);
}

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#6200EE',
		surface: '#FFF',
    primaryMediumEmphasis: 'rgba(255, 255, 255, 0.74)',
		accent: '#03DAC5',
	},
};

export default registerRootComponent(App);