import { AddNewItem } from '../../components/Util/UtilWrite';
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

	function addItem(state, id, name, description, location, amount, categories) {
		let iconName = ICONS[CATEGORIES.indexOf(categories[0])];
		if (id === undefined) {
			id = state.nextId++;
		}
		state.items.push({
			id,
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

	function removeItem(state, id) {
		let itemIndex;
		for (let i = 0; i < state.items.length; i++) {
			if (state.items[i].id === id) {
				itemIndex = i;
				break;
			}
		}
		if (itemIndex !== undefined) {
			state.items = [...state.items.slice(0, itemIndex), ...state.items.slice(itemIndex + 1)];
		}
	}

	return {
		name,
		initialState,
		functions: {
			addItem,
			modifyItem,
			removeItem,
		},
		asyncFunctions: {

		},
	};
};

export default createSliceFromLayout(ItemsLayout);
