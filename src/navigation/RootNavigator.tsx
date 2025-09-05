import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChooseTask from '../screens/ChooseTask';
import Task2Tabs from './Task2Tabs';
import SplashScreen from '../screens/task1/Spalsh';
import IntroductionScreen from '../screens/task1/Introduction';
import FaceUploadScreen from '../screens/task1/FaceUpload';
import GalleryScreen from '../screens/task1/Gallery';
import SuccessScreen from '../screens/task1/Success';

const Root = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Root.Navigator screenOptions={{headerShown:false}}>
      <Root.Screen name="ChooseTask" component={ChooseTask} />
      <Root.Screen name="Splash" component={SplashScreen} />
      <Root.Screen name="Introduction" component={IntroductionScreen} />
      <Root.Screen name="FaceUpload" component={FaceUploadScreen} />
       <Root.Screen name="Gallery" component={GalleryScreen} />
       <Root.Screen name="Success" component={SuccessScreen} />
       <Root.Screen name="Task2" component={Task2Tabs} />
    </Root.Navigator>
  );
}
