import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

/**
 * Creates a slice object (not equivalent to the Redux Toolkit slice) that the
 * useReduxSlice hook below uses. The slice is created from a "layout", which is
 * a function that returns an object with the properties: "name",
 * "initialState", "functions", and "asyncFunctions".
 *
 * The "name" property is the name of the Toolkit slice to be created.
 *
 * The "initialState" property is the state initialized in the Toolkit slice upon
 * creation.
 *
 * The "functions" property is an object that holds functions that change the
 * state of the slice when called. Each function needs to have "state" as its first
 * parameter. This "state" will be the state of the Toolkit slice in question.
 * Using this parameter, you can directly modify the state. To increment a value
 * in the state, for example, called "users", you would make a function called
 * incrementUsers, with the "state" parameter, and call "state.users++" inside
 * the function.
 *
 * The "asyncFunctions" property is similar to the functions property, except
 * these functions do not directly modify the state of the slice. Instead,
 * they are able to do asynchronous work and update the state via the functions
 * in the functions property. To access those functions, the first parameter of
 * all the functions in asyncFunctions has to be "functions". This will be
 * equivalent to an exact replica of the "functions" property above, but do not
 * dismiss the "functions" parameter, as they are not actually identical, and
 * the difference is important.
 *
 * @param {Function} layout A function that returns an object with the
 * properties: name, initialState, functions, and asyncFunctions.
 * @returns A slice object as defined in this manager file.
 */
export const createSliceFromLayout = (layout) => {
  let layoutObj = layout();

  const reducers = {};
  Object.keys(layoutObj.functions).forEach((key) => {
    reducers[key] = (state, action) => {
      layoutObj.functions[key](state, ...action.params);
    };
  });

  const slice = createSlice({
    name: layoutObj.name,
    initialState: layoutObj.initialState,
    reducers,
  });
  return {slice, layout};
};

/**
 * A React hook which allows the client to access and call the methods in
 * a slice.
 * @param {object} sliceContainer The slice (as defined in this manager) object
 * to access methods from.
 * @returns An object that contains all the available functions.
 */
export const useReduxSlice = (sliceContainer) => {
  let layout = sliceContainer.layout();
  let slice = sliceContainer.slice;

  const dispatch = useDispatch();

  const funcs = slice.actions;
  const asyncFuncs = layout.asyncFunctions;

  const newFuncs = {};
  Object.keys(funcs).forEach((key) => {
    newFuncs[key] = (...params) => {
      let result = funcs[key](...params);
      dispatch({type: result.type, params: [...params]});
    };
  });

  const newAsyncFuncs = {};
  Object.keys(asyncFuncs).forEach((key) => {
    newAsyncFuncs[key] = function(...params) {
      dispatch(() => {
        asyncFuncs[key](newFuncs, ...params);
      })
    }
  });

  return {
    ...newFuncs,
    ...newAsyncFuncs
  };
};

/**
 * A function duplicate of the useReduxSlice hook to be used outside of React
 * components.
 * @param {object} sliceContainer The slice (as defined in this manager) object
 * to access methods from.
 * @returns An object that contains all the available functions.
 */
 export const getReduxSlice = (store, sliceContainer) => {
  let layout = sliceContainer.layout();
  let slice = sliceContainer.slice;

  const dispatch = store.dispatch;

  const funcs = slice.actions;
  const asyncFuncs = layout.asyncFunctions;

  const newFuncs = {};
  Object.keys(funcs).forEach((key) => {
    newFuncs[key] = (...params) => {
      let result = funcs[key](...params);
      dispatch({type: result.type, params: [...params]});
    };
  });

  const newAsyncFuncs = {};
  Object.keys(asyncFuncs).forEach((key) => {
    newAsyncFuncs[key] = function(...params) {
      dispatch(() => {
        asyncFuncs[key](newFuncs, ...params);
      })
    }
  });

  return {
    ...newFuncs,
    ...newAsyncFuncs
  };
};

/**
 * A React hook which allows the user to monitor a part of the state of the
 * given slice, at the given path. For each monitored property, this hook
 * must be called again.
 * @param {object} sliceContainer The slice (as defined in this manager) object
 * to access the property from.
 * @param  {...String} path A set of Strings that define where to access the
 * property in the state. For example, if I wanted to access
 * state.users.john.likes, I would put after the "sliceContainer" parameter:
 * "colors", "parimary", "blue".
 * @returns The value of the specified property, which updates upon any changes.
 */
export const useReduxSliceProperty = (sliceContainer, ...path) => {
  return useSelector((state) => {
    let endVal = state[sliceContainer.slice.name];
    let pathCopy = JSON.parse(JSON.stringify(path));
    while(pathCopy.length > 0) {
      endVal = endVal[pathCopy.shift()];
    }
    return endVal;
  });
};

/**
 * A helper function to remove the Redux jargon from store.js. This function is
 * called only in store.js, in its configureStore method as the only parameter.
 * It takes an object which contains key-value pairs of the name of the slice as
 * the key, and the actual slice instance as the value.
 * @param {object} slicesObj An object which contains key-value pairs, in this
 * format: slice name: slice instance.
 * @returns An object in the format that configureStore wants.
 */
export const getSlicesConfig = (slicesObj) => {
  let reducers = {};
  Object.keys(slicesObj).forEach((key) => {
    reducers[key] = slicesObj[key].slice.reducer
  });
  return {reducer: reducers};
};