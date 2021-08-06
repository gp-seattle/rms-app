import React, { useState } from 'react';
import { StyleSheet, View, Text } from "react-native";

import ActionButton from "./ActionButton";
import ActionModal from "./ActionModal";

function ActionDialog() {
    const [visible, setVisible] = useState(false);

    return (
        <View style = {styles.screen}>
            <ActionButton onPress={() => setVisible(true)} />
                <ActionModal
                    visible={visible}
                    onCancel = {() => setVisible(false)}
                />
            <Text>Testing...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        padding: 50,
        width: '85%',
        height: '90%'
    }
  });

export default ActionDialog;