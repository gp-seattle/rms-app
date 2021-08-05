import { configureStore } from "@reduxjs/toolkit";
import { getSlicesConfig } from "./sliceManager";
import counterSlice from "./slices/counterSlice";

export default configureStore(
  getSlicesConfig({
    count: counterSlice
  })
);
