import React from 'react';
import { Text, View } from 'react-native';
import NewItemForm from './NewItemForm';
import NewItemHeader from './NewItemHeader';

const NewItem = () => {
    return (
        <View>
            <NewItemHeader />
            <NewItemForm />
        </View>

    );
}

export default NewItem