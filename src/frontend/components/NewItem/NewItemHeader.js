import React from "react";
import { Button } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const NewItemHeader = ({ onBackPress, title, onCancelPress }) => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: "black",
      }}
    >
      <Text onPress={onBackPress}>Here would go a chevron to the left</Text>
      <Text>Here would go a little title</Text>
      <Button title="I'm a button" onPress={onCancelPress} />
    </View>
  );
};

export default NewItemHeader;
