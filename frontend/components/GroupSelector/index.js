import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const GroupSelector = ({ items, onSelectedChange, style, buttonStyle, ButtonComponent }) => {
	const [selected, setSelected] = useState(
		items.reduce((total, curr) => {
			let newObj = {};
			if (typeof total === 'string') {
				newObj[total] = false;
			} else {
				newObj = { ...total };
			}
			newObj[curr] = false;
			return newObj;
		}),
	);

	useEffect(() => {
		if (onSelectedChange) {
			onSelectedChange(selected);
		}
	}, [selected]);

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginTop: 5,
				marginBottom: 5,
				...style,
			}}>
			{items.map((title) => {
				return (
					<ButtonComponent
						key={title}
						title={title}
						style={buttonStyle}
						onPress={() => {
							setSelected((prevSelected) => {
								let result = { ...prevSelected };
								result[title] = !result[title];
								return result;
							});
						}}
					/>
				);
			})}
		</View>
	);
};

export default GroupSelector;
