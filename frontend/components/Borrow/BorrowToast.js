import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

function BorrowToast(props) {
    return (
        <Snackbar
            style = {styles.toast}
            visible={true}
            onDismiss={props.onCancel}
        >
            <Text style = {styles.text}> Items Borrowed </Text>
            <Button icon = "check" />
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    toast: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 20,
        bottom: 75
    },
    text: {
        color: 'black',
        height: '100%',
    }
  });

  export default BorrowToast;