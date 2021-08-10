import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, TextInput, TouchableRipple } from 'react-native-paper';

const useComponentSize = () => {
  const [size, setSize] = useState({width: 0, height: 0});

  const onLayout = useCallback(event => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

/*
  list is an array of objects, each with a label and value key
*/
const ListDropdown = ({ list, onValueChange, placeholder, style, dropdownStyle }) => {
	const [value, setValue] = useState();
	const [showDropdown, setShowDropdown] = useState(false);
  const [size, onLayout] = useComponentSize();

  useEffect(() => {
    if(!placeholder) {
      selectItem(list[0].label);
    }
  }, []);

	function selectItem(val) {
		setValue(val);
		setShowDropdown(false);
		if (onValueChange) {
			onValueChange(val);
		}
	}

	return (
		<Menu
			visible={showDropdown}
			onDismiss={() => setShowDropdown(false)}
			anchor={
				<TouchableRipple
					onPress={() => setShowDropdown(true)}
					style={style}
          onLayout={onLayout}
					borderless={true}>
					<View
						pointerEvents="none"
						style={style}>
						<TextInput
              placeholder={placeholder}
							value={value}
							underlineColor="transparent"
							style={{ borderRadius: 5, backgroundColor: 'transparent' }}
							right={<TextInput.Icon name={showDropdown ? 'menu-up' : 'menu-down'} />}
						/>
					</View>
				</TouchableRipple>
			}
      style={{marginTop: size.height}}>
			<ScrollView style={{...dropdownStyle, width: size.width}}>
				{list.map((item) => (
					<Menu.Item title={item.label} key={item.value} onPress={() => selectItem(item.label)} />
				))}
			</ScrollView>
		</Menu>
	);
};

export default ListDropdown;
