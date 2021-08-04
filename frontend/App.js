import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";

import { registerRootComponent } from "expo";

import ActionButton from "./components/MockComponent/ActionButton";
import ActionDialog from "./components/MockComponent/ActionDialog";

function App() {
  const [visible, setVisible] = useState(false);

  function cancelActionDialog() {
    setVisible(false);
  }

  function openActionDialog() {
    setVisible(true);
  }

  const dimEffect = useRef(new Animated.Value(0)).current;

  function dimIn() {
    Animated.timing(dimEffect, {
      toValue: 1,
      duration: 1000
    }).start();
  }

  function dimOut() {
    Animated.timing(dimEffect, {
      toValue: 0,
      duration: 1000
    }).start();
  }

  let dimBackground;

  if (visible) {
    dimBackground = (
      <Animated.View style = {[
        styles.dimContainer, {
          opacity: dimEffect
          }
        ]} 
      >
      </Animated.View>
    );
  }

  return (
    <View style={styles.screen}>
      <ActionButton onPress={{openActionDialog, dimIn}} />
        <ActionDialog
          visible={visible}
          onCancel = {{cancelActionDialog, dimOut}}
        />
      <Text>Testing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50
  },
  dimContainer: {
    flex: 1
  },
  dim: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default registerRootComponent(App);
