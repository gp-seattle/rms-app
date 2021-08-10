import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withTheme } from 'react-native-paper';
import RMSIcon from '../../RMSIcon';

const ListCard = withTheme(({ title, favorite, theme }) => {
	return (
		<View
			style={{
				...styles.itemCard,
				backgroundColor: theme.colors.surfaceOverlay,
			}}>
			<View
				style={{
					...styles.caption,
					backgroundColor: theme.colors.surface,
				}}>
				<Text style={styles.title}>{title}</Text>
				<RMSIcon
					iconName={favorite ? 'star' : 'star-outline'}
					size={25}
					color={"#000"}
					focusColor={"#000"}
				/>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	itemCard: {
		flexDirection: 'column',
		height: 175,
		width: 125,
		borderRadius: 10,
		justifyContent: 'flex-end',
	},
	title: {
		width: '50%',
		flex: 1,
		lineHeight: 30,
		fontSize: 17,
	},
	caption: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		padding: 5,
	},
});

export default ListCard;
