import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SubmitBar from '../../SubmitBar';
import { AddNewItem } from '../../Util/UtilWrite';
import NewItemForm from '../NewItemForm';

const NewItem = ({ navigation }) => {
	const formRef = useRef();
	const [valid, setValid] = useState();

	function submit() {
		const values = formRef.current.getValues();
		AddNewItem(
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
