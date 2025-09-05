/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { AppProvider } from './src/store/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar, useColorScheme } from 'react-native';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
   <AppProvider>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>

</AppProvider>
  );
}





export default App;
