import { createSliceFromLayout } from '../sliceManager';

const ItemsLayout = () => {
	const name = 'items';
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
	const initialState = {
		nextId: 0,
		items: [],
	};

	function addItem(state, name, description, location, amount, categories) {
		let iconName = ICONS[CATEGORIES.indexOf(categories[0])];
		state.items.push({
			id: state.nextId++,
			name,
			description,
			location,
			iconName,
			amount,
			categories,
		});
	}

	function modifyItem(state, id, newProperties) {
		let oldItemIndex = state.items.map((item) => item.id).indexOf(id);
		let newItem = { ...state.items[oldItemIndex], ...newProperties };
		if (newProperties.categories) {
			let iconName = ICONS[CATEGORIES.indexOf(categories[0])];
			newItem[iconName] = iconName;
		}
		state.items[oldItemIndex] = newItem;
	}

	return {
		name,
		initialState,
		functions: {
			addItem,
			modifyItem,
		},
		asyncFunctions: {},
	};
};

export default createSliceFromLayout(ItemsLayout);
