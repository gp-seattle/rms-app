import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Menu, Searchbar, TextInput, TouchableRipple } from 'react-native-paper';

const useComponentSize = () => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	const onLayout = useCallback((event) => {
		const { width, height } = event.nativeEvent.layout;
		setSize({ width, height });
	}, []);

	return [size, onLayout];
};

/*
  list is an array of objects, each with a label and value key
*/
const SearchableDropdown = ({
	list,
	onValueChange,
	placeholder,
	maxHeight,
	style,
	anchorStyle,
	dropdownStyle,
}) => {
	const [value, setValue] = useState();
	const [showDropdown, setShowDropdown] = useState(false);
	const [size, onLayout] = useComponentSize();
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		if (!placeholder) {
			selectItem(list[0].label);
		}
	}, []);

	function selectItem(val) {
		setValue(val);
		setShowDropdown(false);
		setSearchQuery('');
		if (onValueChange) {
			onValueChange(val);
		}
	}

	return (
		<Menu
			visible={showDropdown}
			onDismiss={() => setShowDropdown(false)}
			contentStyle={dropdownStyle}
			style={style}
			anchor={
				<TouchableRipple
					onPress={() => setShowDropdown(true)}
					onLayout={onLayout}
					style={style}
					borderless={true}>
					<View pointerEvents="none" style={anchorStyle}>
						<TextInput
							placeholder={placeholder}
							value={value}
							underlineColor="transparent"
							theme={{ colors: { primary: 'transparent' } }}
							style={{ borderRadius: 5, backgroundColor: 'transparent' }}
							right={<TextInput.Icon name={showDropdown ? 'menu-up' : 'menu-down'} />}
						/>
					</View>
				</TouchableRipple>
			}
			style={{ marginTop: size.height }}>
			<View style={{ ...dropdownStyle, width: size.width, maxHeight: maxHeight || 150 }}>
				<Searchbar
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={styles.searchBar}
				/>
				<ScrollView>
					{list
						.filter((item) => {
							if (item.value) {
								return item.value
									.replace(/ /g, '')
									.toLowerCase()
									.includes(searchQuery.replace(/ /g, '').toLowerCase());
							}
							console.warn(
								'Each list item needs a value attribute! (SearchableDropdown component)',
							);
							return true;
						})
						.map((item) => {
							if (!item.value) {
								console.warn(
									'Each list item needs a label attribute! (SearchableDropdown component)',
								);
							}
							return (
								<Menu.Item
									title={item.label}
									key={item.value}
									onPress={() => selectItem(item.label)}
								/>
							);
						})}
				</ScrollView>
			</View>
		</Menu>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		borderWidth: 0,
		elevation: 0,
		shadowOpacity: 0,
	},
});

export default SearchableDropdown;
