import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import GroupSelector from '../GroupSelector';
import RMSTitle from '../RMSTitle';

const Dashboard = withTheme(({ theme }) => {
	const GROUPS = ['Gracepoint', 'A2F', 'Klesis', 'Personal'];
	const [groupsSelected, setGroupsSelected] = useState();

	function newSelectionHandler(selected) {
		setGroupsSelected(selected);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.container}>
			<RMSTitle />
			<View>
				<Text style={{ color: theme.colors.surfaceMediumEmphasis }}>Group</Text>
				<GroupSelector items={GROUPS} onSelectedChange={newSelectionHandler} />
			</View>
			<StatusBar style="auto" />
		</ScrollView>
	);
});

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
});

const DashboardScreen = () => {
	return <Dashboard />;
};

export default DashboardScreen;
