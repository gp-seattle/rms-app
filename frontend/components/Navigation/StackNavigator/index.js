import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Navigator from "../Navigator";

const StackNavigator = (props = { children }) => {
  const newProps = { ...props };
  newProps.navigatorComponents = createStackNavigator();
  return (
    <Navigator {...newProps} />
  );
}

export default StackNavigator;