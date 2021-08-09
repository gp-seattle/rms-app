import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ListCard from "../ListCard";

const ListGroup = ({ lists, spaceBetween }) => {
	function renderList({ item }) {
		return <ListCard title={item.title} favorite={item.isFavorite} />;
	}

	return (
		<FlatList
			data={lists}
			renderItem={renderList}
			keyExtractor={(list) => list.id}
			horizontal={true}
			contentContainerStyle={{
				justifyContent: 'flex-start',
				alignItems: 'center',
			}}
			ItemSeparatorComponent={function () {
				return <View style={{ width: spaceBetween || 10 }}></View>;
			}}
		/>
	);
};

export default ListGroup;