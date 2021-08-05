import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import GroupSelector from '../GroupSelector';
import RMSTitle from '../RMSTitle';
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native-gesture-handler';
import RMSToggleButton from '../RMSToggleButton';

const ItemCard = ({ title, isFavorite }) => {

}

const ItemGroup = ({ items }) => {
	function renderItem(title, isFavorite) {
		return <ItemCard title={title} favorite={isFavorite} />;
	}

	return <FlatList style={{ flexDirection }}></FlatList>;
}

const GroupSelection = withTheme(({ items, onSelectedChange, theme }) => {
	return (
		<View>
			<Text style={{ color: theme.colors.surfaceMediumEmphasis }}>Group</Text>
			<GroupSelector items={items} onSelectedChange={onSelectedChange} ButtonComponent={RMSToggleButton} />
		</View>
	);
});

const ListSelection = ({ items, onNewSelection }) => {
	const [listSelected, setListSelected] = useState(items[0]);

	useEffect(() => {
		if(onNewSelection) {
			onNewSelection(listSelected);
		}
	}, [listSelected]);

	return (
		<View style={styles.section}>
			<Text style={styles.title}>Lists</Text>
			<Picker
				selectedValue={listSelected}
				style={{ height: 50, width: 150 }}
				mode="dropdown"
				onValueChange={(item) => setListSelected(item)}>
				{items.map((item) => {
					return <Picker.Item label={item} value={item} key={item} />;
				})}
			</Picker>
		</View>
	);
};

const Dashboard = () => {
	const GROUPS = ['Gracepoint', 'A2F', 'Klesis', 'Personal'];
	const LISTS = ['All', 'Other List', 'Another List'];

	const [groupsSelected, setGroupsSelected] = useState();
	const [listSelected, setListSelected] = useState();

	function newGroupHandler(groupsSelected) {
		setGroupsSelected(groupsSelected);
	}

	function newListHandler(listSelected) {
		setListSelected(listSelected);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.container}>
			<RMSTitle />
			<GroupSelection items={GROUPS} onSelectedChange={newGroupHandler} />
			<ListSelection items={LISTS} onNewSelection={newListHandler} />
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
	section: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 25,
	},
});

const DashboardScreen = () => {
	return <Dashboard />;
};

export default DashboardScreen;
