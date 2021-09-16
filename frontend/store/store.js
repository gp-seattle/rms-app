import { configureStore } from "@reduxjs/toolkit";
import { getSlicesConfig } from "./sliceManager";
import counterSlice from "./slices/counterSlice";
import itemsSlice from "./slices/itemsSlice";
import itemTypeSlice from "./slices/itemTypeSlice";
import toastSlice from "./slices/toastSlice";

export default configureStore(
  getSlicesConfig({
    count: counterSlice,
    items: itemsSlice,
    itemsType: itemTypeSlice,
    toast: toastSlice
  })
);
