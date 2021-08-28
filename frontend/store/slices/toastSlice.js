import { createSliceFromLayout } from '../sliceManager';

const ToastLayout = () => {
	const name = 'toast';
	const initialState = {
		visible: false,
		message: '',
		iconName: '',
	};
	function show(state, message, iconName) {
		state.message = message;
		state.iconName = iconName;
		state.visible = true;
	}
	function hide(state) {
		state.visible = false;
	}
	return {
		name,
		initialState,
		functions: { show, hide },
		asyncFunctions: {},
	};
};
export default createSliceFromLayout(ToastLayout);
