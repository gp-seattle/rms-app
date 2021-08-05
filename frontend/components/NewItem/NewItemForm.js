import React from "react";
import { Button, Text, TextInput, View } from "react-native";

const NewItemForm = () => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: "black",
      }}
    >
      <TextInput placeholder="Item Name" />
      <TextInput placeholder="Item Location" />
      <TextInput placeholder="Item Description" />
      <Text>Catagory area</Text>
      <Text>Group</Text>
      <View
        style={{
          borderWidth: 2,
          borderColor: "black",
        }}
      >
        <Text>here will go the form to select the group(s)</Text>
      </View>
      <Button title="Save" />
    </View>
  );
};



export default NewItemForm;
