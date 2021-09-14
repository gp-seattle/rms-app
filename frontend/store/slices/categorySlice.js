import { createSliceFromLayout } from '../sliceManager';

const CategoryLayout = () => {
	const name = 'categories';
	const initialState = {
		categories: [],
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

	function addCategory(state, id, name, description, categories, itemIds) {
		state.categories.push({
			id,
			name,
			description,
			categories,
			itemIds,
		});
	}

	function modifyCategory(state, id, newProperties) {
		let oldIndex = state.categories.map((category) => category.id).indexOf(id);
		if(newProperties.items) {
			const items = newProperties.items;
			delete newProperties.items;
			newProperties.itemIds = items;
		}
		let newItemType = { ...state.categories[oldIndex], ...newProperties };
		if (newProperties.categories) {
			let iconName = ICONS[CATEGORIES.indexOf(newProperties.categories[0])];
			newItemType[iconName] = iconName;
		}
		state.categories[oldIndex] = newItemType;
	}

	function removeCategory(state, id) {
		let index;
		for (let i = 0; i < state.categories.length; i++) {
			if (state.categories[i].id === id) {
				index = i;
				break;
			}
		}
		if (index !== undefined) {
			state.categories = [
				...state.categories.slice(0, index),
				...state.categories.slice(index + 1),
			];
		}
	}

	return {
		name,
		initialState,
		functions: {
			addCategory,
			modifyCategory,
			removeCategory,
		},
		asyncFunctions: {},
	};
};

export default createSliceFromLayout(CategoryLayout);
