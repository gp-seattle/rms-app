import React from "react";

import { Text, View } from "react-native";

const RMSTitle = () => {
	return <View
		style={{
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'flex-start',
      marginTop: "20%"
		}}>
		<Text style={{ fontSize: 35, fontWeight: "bold" }}>Spark</Text>
		<Text style={{ fontSize: 35, fontWeight: "normal", marginLeft: 10 }}>RMS</Text>
	</View>;
};

export default RMSTitle;