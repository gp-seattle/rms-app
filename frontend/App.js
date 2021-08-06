import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Provider } from "react-redux";
import store from "./store/store";
import { registerRootComponent } from "expo";

import ActionDialog from "./components/ActionDialog";

function App() {
  return (
    <Provider store = {store}>
      <View style = {styles.container}>
        <ActionDialog />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default registerRootComponent(App);