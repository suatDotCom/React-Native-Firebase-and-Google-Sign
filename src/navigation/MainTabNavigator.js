import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

const WelcomeStack = createStackNavigator(
  {
    Welcome: WelcomeScreen
  },
  {
    header: null,
    headerMode: "none",
    navigationOptions: {
      header: null
    }
  }
);

WelcomeStack.navigationOptions = {
  tabBarLabel: "Welcome",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

const LoginStack = createStackNavigator({
  Login: LoginScreen
});

LoginStack.navigationOptions = {
  tabBarLabel: "Login",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-log-in" : "md-log-in"}
    />
  )
};

export default createBottomTabNavigator({
  WelcomeStack
});
