import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';

function ActionButton(props) {
    const {colors} = useTheme();
    return(
        <FAB
            style = {styles.fab}
            icon = 'plus'
            onPress = {props.onPress}
            color = 'black'
        />
    );
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 5,
      right: 0,
      bottom: 0
    }
  })

export default ActionButton;