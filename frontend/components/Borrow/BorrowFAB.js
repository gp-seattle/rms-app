import React from "react";
import { StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

function BorrowFAB(props) {
    return(
        <FAB
            style = {styles.fab}
            label = 'BORROW'
            onPress = {props.onPress}
            color = 'black'
        />
    );
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 5,
      right: 10,
      bottom: 110,
    }
  })

export default BorrowFAB;