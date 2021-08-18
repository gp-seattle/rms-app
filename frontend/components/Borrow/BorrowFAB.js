import React from "react";
import { StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';

function BorrowFAB({onPress, theme}) {
    return(
        <FAB
            style = {styles.fab}
            label = 'BORROW'
            onPress = {onPress}
            color = {theme.colors.text}
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

export default withTheme(BorrowFAB);