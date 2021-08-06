import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import store from './store/store';
import NewItem from './components/NewItem';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

function App() {
	return (
		<Provider store={store}>
			<PaperProvider theme={theme}>
				<View>
					<NewItem />
				</View>
				<View style={styles.container}>
					<StatusBar style="auto" />
				</View>
			</PaperProvider>
		</Provider>
	);
}

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#6200EE',
		surface: '#FFF',
		surfaceMediumEmphasis: 'rgba(0, 0, 0, 0.6)',
		surfaceOverlay: 'rgba(33, 33, 33, 0.08)',
		primaryMediumEmphasis: 'rgba(255, 255, 255, 0.74)',
		accent: '#03DAC5',
		secondary: '#C8FFF4'
	},
	fonts: {
		regular: 'Roboto',
	},
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default registerRootComponent(App);
