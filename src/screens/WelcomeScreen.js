import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Dimensions
} from "react-native";
import firebase from "react-native-firebase";
import { GoogleSignin } from "react-native-google-signin";

const { width: WIDTH } = Dimensions.get("window");

export class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  Logout = () => {
    AsyncStorage.removeItem("userData")
      .then(() => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.props.navigation.navigate("Login");
            this.revokeAccess();
          })
          .catch(error => {
            Alert.alert("Logout Error FB");
          });
      })
      .catch(error => {
        Alert.alert("Logout Error Storage");
      });
  };
  render() {
    const { params } = this.props.navigation.state;
    const photoURL = params ? params.photoURL : null;
    const displayName = params ? params.displayName : null;

    return (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoURL }} style={styles.photo} />
          <Text> Welcome {displayName} </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.btnLogout}
            onPress={this.Logout.bind(this)}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  photoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  photo: {
    borderRadius: 100,
    width: 100,
    height: 100,
    marginBottom: 20
  },
  btnLogout: {
    width: WIDTH - 100,
    height: 45,
    bottom: 160,
    backgroundColor: "#DB4437",
    justifyContent: "center"
  },
  logoutText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center"
  }
});

export default WelcomeScreen;
