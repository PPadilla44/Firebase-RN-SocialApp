import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";
import MessageScreen from "./screens/MessageScreen";
import NotificationScreen from "./screens/NotificationScreen";
import PostScreen from "./screens/PostScreen";
import ProfileScreen from "./screens/ProfileScreen";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBIVQeDPofQ6I52mFwv0yt4DLXTdvSw5y0",
  authDomain: "socialapp-75524.firebaseapp.com",
  projectId: "socialapp-75524",
  storageBucket: "socialapp-75524.appspot.com",
  messagingSenderId: "542468161563",
  appId: "1:542468161563:web:f9bc894ddc67e5fb74b8be"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const AppStack = createStackNavigator({
  Home: HomeScreen
})

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
})


export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
)