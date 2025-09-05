import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image} from 'react-native';

import Splash2 from '../screens/task2/Splash2';
import LandingPage from '../screens/task2/LandingPage';
import Profile from '../screens/task2/Profile';
import Friends from '../screens/task2/Friends';

const Tab = createBottomTabNavigator();
const WardrobeStack = createNativeStackNavigator();

function WardrobeStackScreen() {
  return (
    <WardrobeStack.Navigator screenOptions={{headerShown:false}}>
      <WardrobeStack.Screen name="Splash2" component={Splash2} />
      <WardrobeStack.Screen name="LandingPage" component={LandingPage} />
    </WardrobeStack.Navigator>
  );
}

export default function Task2Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:'#000',
        tabBarStyle:{
          backgroundColor:'#fff',
          borderTopWidth:1,
          borderTopColor:'#ccc',
          height:60,
        }
      }}
    >
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeStackScreen}
        options={{
          tabBarLabel:'Wardrobe',
          tabBarIcon: ({focused, size}: {focused: boolean; size?: number}) => (
            <Image source={require('../../assets/images/hanger.png')}
                   style={{width:size??20, height:size??20, tintColor: focused ? '#000' : '#888'}} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused, size}: {focused: boolean; size?: number}) => (
            <Image source={require('../../assets/images/profile.png')}
                   style={{width:size??20, height:size??20, tintColor: focused ? '#000' : '#888'}} />
          )
        }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{
          tabBarIcon: ({focused, size}: {focused: boolean; size?: number}) => (
            <Image source={require('../../assets/images/friends.png')}
                   style={{width:size??20, height:size??20, tintColor: focused ? '#000' : '#888'}} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
