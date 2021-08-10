import React from 'react';
import { DataStore } from 'aws-amplify';

function UtilWrite(props) {
    function query(num, category) {
        const table = await DataStore.query();
        const item = table['data']['main'][1]['name'];
        console.log(item);
    }
}

export default UtilWrite;