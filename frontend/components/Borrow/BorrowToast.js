import React from "react";
import { View, StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function BorrowToast({visible, onCancel}) {
    return (
        <Snackbar
            style = {styles.toast}
            visible={visible}
            onDismiss={onCancel}
            duration = {900}
        >
            <View style = {styles.view}>
                <Text style = {styles.text}> Items Borrowed </Text>
                <MaterialCommunityIcons 
                    name = "check" 
                    color = "black"
                    size = {20}
                />
            </View>
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    toast: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 20,
        bottom: 75
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '105%'
    },
    text: {
        color: 'black'
    }
  });

  export default BorrowToast;