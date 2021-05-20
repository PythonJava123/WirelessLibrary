
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import BookTransactionScreen from './Screens/bookTransactionScreen';
import {createAppContainer} from 'react-navigation';

import {createBottomTabNavigator} from 'react-navigation-tabs';

import SearchScreen from './Screens/searchScreen';

export default class App extends React.Component{
render(){
  return(
    <AppContainer/>
  )
}
}

const tabNavigator = createBottomTabNavigator({
  BookTransaction : {screen: BookTransactionScreen},
  SearchScreen : {screen: SearchScreen}
},
{
defaultNavigationOptions: ({navigation}) => ({
  tabBarIcon: ({}) => { const routeName = navigation.state.routeName
if(routeName === 'BookTransaction'){
  return(
    <Image source={require('./assets/book.png')} style={{width:40, height:40}}></Image>
  )}
  else if (routeName === 'SearchScreen'){
    return(
      <Image source={require('./assets/searchingbook.png')} style={{width:40, height:40}}></Image>
    )
  }
  }
})
}
)

const AppContainer = createAppContainer(tabNavigator);
