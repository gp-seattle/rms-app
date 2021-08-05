import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RMSTitle from '../../RMSTitle';
import GroupSelection from '../GroupSelection';
import ListsSection from '../ListsSection';

const DashboardScreen = () => {
	const GROUPS = ['Gracepoint', 'A2F', 'Klesis', 'Personal'];
	const CATEGORIES = ['All', 'Other List', 'Another List'];
	const LISTS = [
		{
			id: '0',
			title: '8/22 Camping',
			isFavorite: false,
		},
		{
			id: '1',
			title: 'TFN Tech',
			isFavorite: true,
		},
		{
			id: '2',
			title: 'Music Video Filming',
			isFavorite: false,
		},
		{
			id: '3',
			title: "Jeremy's Lifegroup",
			isFavorite: false,
		},
	];

	const [groupsSelected, setGroupsSelected] = useState();
	const [categorySelected, setCategorySelected] = useState();

	function newGroupHandler(groupsSelected) {
		setGroupsSelected(groupsSelected);
	}

	function newListHandler(categorySelected) {
		setCategorySelected(categorySelected);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.container}>
			<RMSTitle />
			<GroupSelection items={GROUPS} onSelectedChange={newGroupHandler} />
			<ListsSection categories={CATEGORIES} lists={LISTS} onNewSelection={newListHandler} />
		</ScrollView>
	);
};

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

export default DashboardScreen;
