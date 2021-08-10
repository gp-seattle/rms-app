import React from "react";
import { StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

function ActionButton(props) {
    return(
        <FAB
            style = {styles.fab}
            icon = 'plus'
            onPress = {props.onPress}
            color = {props.theme.colors.text}
        />
    );
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 5,
      right: 30,
      bottom: 30,
    }
  })

export default withTheme(ActionButton);