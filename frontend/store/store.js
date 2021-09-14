import { configureStore } from "@reduxjs/toolkit";
import { getSlicesConfig } from "./sliceManager";
import counterSlice from "./slices/counterSlice";
import itemsSlice from "./slices/itemsSlice";
import categorySlice from "./slices/categorySlice";
import toastSlice from "./slices/toastSlice";

export default configureStore(
  getSlicesConfig({
    count: counterSlice,
    items: itemsSlice,
    categories: categorySlice,
    toast: toastSlice
  })
);
