import { createSliceFromLayout } from '../sliceManager';

const ItemsTypeLayout = () => {
	const name = 'itemsType';
	const initialState = {
		itemTypes: [],
	};
	const CATEGORIES = ['Video', 'Audio', 'Sports', 'Tech', 'Ambiance', 'Instruments', 'Lighting'];
	const ICONS = [
		'camera',
		'microphone',
		'pokeball',
		'alien',
		'glass-wine',
		'bugle',
		'lighthouse-on',
	];

	function addItemType(state, id, name, description, categories, itemIds) {
		state.itemTypes.push({
			id,
			name,
			description,
			categories,
			itemIds,
		});
	}

	function modifyItemType(state, id, newProperties) {
		let oldIndex = state.itemTypes.map((itemType) => itemType.id).indexOf(id);
		let newItemType = { ...state.items[oldIndex], ...newProperties };
		if (newProperties.categories) {
			let iconName = ICONS[CATEGORIES.indexOf(categories[0])];
			newItemType[iconName] = iconName;
		}
		state.items[oldItemIndex] = newItemType;
	}

	function removeItemType(state, id) {
		let index;
		for (let i = 0; i < state.itemTypes.length; i++) {
			if (state.itemTypes[i].id === id) {
				index = i;
				break;
			}
		}
		if (index !== undefined) {
			state.itemTypes = [
				...state.itemTypes.slice(0, index),
				...state.itemTypes.slice(index + 1),
			];
		}
	}

	return {
		name,
		initialState,
		functions: {
			addItemType,
			modifyItemType,
			removeItemType,
		},
		asyncFunctions: {},
	};
};

export default createSliceFromLayout(ItemsTypeLayout);
