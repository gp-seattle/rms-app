import React from "react";
import { View, StyleSheet, Button, TouchableOpacity, Modal } from 'react-native';

function ActionModal(props) {
    return(
        <Modal
            transparent = {true}
            visible={props.visible}
            animationType = "slide"
        >
            <TouchableOpacity style = {styles.modalContainer} onPress ={props.onCancel} >
                <View style = {styles.container}>
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="CREATE LIST +" color = 'white' />
                        </View>
                        <View style={styles.button}>
                            <Button title="ADD NEW ITEM +" color = 'white' />
                        </View>
                        <View style={styles.button}>
                            <Button title="MAKE RESERVATION" color = 'white' />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1
    },
    container: {
        backgroundColor: '#23036A',
        borderRadius: 30,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '30%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '80%',
        height: '100%'
    },
    button: {
        width: '100%',
        backgroundColor: '#6200EE'
    }
});

export default ActionModal;