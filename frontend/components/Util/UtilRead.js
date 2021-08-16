import { DataStore } from 'aws-amplify';

function UtilRead(props) {
    function query(num, category) {
        const table = await DataStore.query();
        const item = table['data']['main'][1]['name'];
        console.log(item);
    }
}

export default UtilRead;