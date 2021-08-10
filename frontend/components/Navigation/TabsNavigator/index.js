import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Navigator from "../Navigator";

const TabsNavigator = (props = { children }) => {
  const newProps = { ...props };
  newProps.navigatorComponents = createMaterialBottomTabNavigator();
  return (
    <Navigator {...newProps} />
  );
}

export default TabsNavigator;