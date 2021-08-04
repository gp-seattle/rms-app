import * as React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Navigator from "../Navigator";

const TabsNavigator = (props = { children }) => {
  const newProps = { ...props };
  newProps.navigatorComponents = createBottomTabNavigator();
  return (
    <Navigator {...newProps} />
  );
}

export default TabsNavigator;