import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Dashboard = () => {
	return (
		<View style={styles.container}>
			<Text>I am an app now powered by Redux!</Text>
			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Dashboard;