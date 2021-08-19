import { configureStore } from "@reduxjs/toolkit";
import { getSlicesConfig } from "./sliceManager";
import counterSlice from "./slices/counterSlice";
import itemsSlice from "./slices/itemsSlice";
import itemTypeSlice from "./slices/itemTypeSlice";

export default configureStore(
  getSlicesConfig({
    count: counterSlice,
    items: itemsSlice,
    itemType: itemTypeSlice
  })
);
