import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useReduxSlice } from '../../../store/sliceManager';
import itemsSlice from '../../../store/slices/itemsSlice';
import SubmitBar from '../../SubmitBar';
import NewItemForm from '../NewItemForm';

const NewItem = ({ navigation }) => {
	const formRef = useRef();
	const [valid, setValid] = useState();
	const itemsInterface = useReduxSlice(itemsSlice);

	function submit() {
		const values = formRef.current.getValues();
		itemsInterface.addItem(
			values.name,
			values.description,
			values.location,
			values.amount,
			values.categories,
		);
		navigation.goBack();
	}

	return (
		<View>
			<ScrollView style={styles.container} contentContainerStyle={styles.container}>
				<NewItemForm ref={formRef} onValidChange={setValid} />
			</ScrollView>
			<SubmitBar
				submitDisabled={!valid}
				onCancel={navigation.goBack}
				onSubmit={submit}
				iconName="plus"
				submitText="Save Item"
				cancelText="Cancel"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		justifyContent: 'center',
		alignContent: 'center',
	},
	container: {
		backgroundColor: '#FFF',
		paddingLeft: '3%',
		paddingRight: '3%',
		height: '100%',
	},
	contentContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
});

export default NewItem;
