
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
console.disableYellowBox = true;
import AppNavigator from './src/navigation/AppNavigator';

// import firebase from 'react-native-firebase';

// const firebaseConfig= {
//   apiKey: "",
//   authDomain: "",
//   databaseURL: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: ""
// }

// var app = firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
