import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import ActionDialog from '../../DashboardFab/ActionDialog';
import ListElement from '../../ListElement';
import RMSTitle from '../../RMSTitle';
import SwipeListElement from '../../SwipeListElement';
import GroupSelection from '../GroupSelection';
import ListsSection from '../ListsSection';

const DashListElement = withTheme(({ iconName, primaryText, secondaryText, theme }) => {
	return (
		<ListElement height={70} iconLeft={iconName} iconSize={20} iconColor={theme.colors.text}>
			<Text style={{ fontSize: 15, paddingBottom: 3 }}>{primaryText}</Text>
			<Text style={{ fontSize: 12, color: 'gray' }}>{secondaryText}</Text>
		</ListElement>
	);
});

const DashboardScreen = (props) => {
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
	const CHECKED_OUT = [
		{
			id: '0',
			title: 'Sunday Setup',
			returnBy: '8/5',
			icon: 'format-list-bulleted',
		},
		{
			id: '1',
			title: '8/7 TFN',
			returnBy: '8/7',
			icon: 'format-list-bulleted',
		},
		{
			id: '2',
			title: 'Sony AIII',
			returnBy: '8/23',
			icon: 'camera',
		},
	];
	const RESERVATIONS = [
		{
			id: '0',
			title: 'Sports Equipment',
			reserved: '8/22 - 8/25',
			icon: 'format-list-bulleted',
		},
		{
			id: '1',
			title: 'Drill',
			reserved: '8/19',
			icon: 'wrench',
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
		<>
			<ScrollView style={styles.container} contentContainerStyle={styles.container}>
				<View style={styles.contentContainer}>
					<RMSTitle />
					<GroupSelection
						items={GROUPS.map((group) => group.toUpperCase())}
						onSelectedChange={newGroupHandler}
					/>
					<ListsSection
						categories={CATEGORIES}
						lists={LISTS}
						onNewSelection={newListHandler}
					/>
					<Text style={styles.title}>Checked Out</Text>
					{CHECKED_OUT.map((item) => {
						return (
							<SwipeListElement
								buttonText="Return"
								backgroundColor="#E71B1B"
								textColor="white"
								fontWeight='bold'
								key={item.id}
								iconName={item.icon}
								primaryText={item.title}
								secondaryText={'Return ' + item.returnBy}
							/>
						);
					})}
					<Text style={styles.title}>Reservations</Text>
					{RESERVATIONS.map((item) => {
						return (
							<SwipeListElement
								buttonText="Delete"
								backgroundColor="#E71B1B"
								textColor="white"
								fontWeight='bold'
								key={item.id}
								iconName={item.icon}
								primaryText={item.title}
								secondaryText={'Reserved ' + item.reserved}
							/>
						);
					})}
				</View>
			</ScrollView>
			<ActionDialog onAddItem={props.onAddItem} />
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	contentContainer: {
		marginBottom: 100,
	},
	title: {
		marginTop: 20,
		fontWeight: 'bold',
		fontSize: 25,
	},
});

export default DashboardScreen;
