import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "react-native-google-signin";
import firebase from "react-native-firebase";

import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/Ionicons";
import { SocialIcon } from "react-native-elements";

import backgroundImage from "../assets/images/login-bg.jpg";
import logo from "../assets/images/logo.png";

import WelcomeScreen from "../screens/WelcomeScreen";

const { width: WIDTH } = Dimensions.get("window");

export class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.unsubscriber = null;
    this.state = {
      showPass: false,
      press: false,
      isSigninInProgress: false,
      signedIn: false,
      user: null,
      userInfo: null
    };
  }

  showPass = () => {
    if (!this.state.press) this.setState({ showPass: false, press: true });
    else this.setState({ showPass: true, press: false });
  };

  signInWithGoogleAsync = async () => {
    this.setState({ isSigninInProgress: true });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn()
        .then(data => {
          const credential = firebase.auth.GoogleAuthProvider.credential(
            data.idToken,
            data.accessToken
          );

          return firebase.auth().signInWithCredential(credential);
        })
        .then(currentUser => {
          console.log(
            `Google Login with user : ${JSON.stringify(currentUser.user)}`
          );

          AsyncStorage.setItem("userData", JSON.stringify(currentUser.user));

          this.props.navigation.navigate("Welcome", {
            displayName: currentUser.user.displayName,
            photoURL: currentUser.user.photoURL
          });

          // this.props.navigation.push({
          //   component: WelcomeScreen,
          //   passProps: {
          //     displayName: currentUser.user.displayName,
          //     photoURL: currentUser.user.photoURL
          //   }
          // });

          this.setState({
            user: currentUser.user,
            signedIn: true
          });
        })
        .catch(error => {
          console.log(`Login fail with error: ${error}`);
        });
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      this.setState({
        isSigninInProgress: false
      });
    }
  };

  userControl = async () => {
    try {
      // await AsyncStorage.getItem("userData").then(userData => {
      //   if (userData)

      // });

      var userData = await AsyncStorage.getItem("userData");
      if (userData) {
        this.setState({
          user: JSON.parse(userData),
          signedIn: true
        });
      }
    } catch (error) {
      console.log("cpwm error: ", error);
    }
  };

  componentWillMount() {
    this.userControl();
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(changedUser => {
      this.setState({ user: changedUser });
    });
    GoogleSignin.configure({
      webClientId:
        "947795782597-pgc6u0cv6k7k7sd5nfn55sph12d30p82.apps.googleusercontent.com",
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceConsentPrompt: false
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isSigninInProgress}
          textContent={"Loading..."}
          textStyle={styles.text}
        />
        {!this.state.signedIn ? (
          <ImageBackground
            source={backgroundImage}
            style={styles.backgroundContainer}
          >
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="md-person"
                size={28}
                color="rgba(255,255,255,0.7)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.7)"
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="md-lock"
                size={28}
                color="rgba(255,255,255,0.7)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={this.state.showPass}
                placeholderTextColor="rgba(255,255,255,0.7)"
                underlineColorAndroid="transparent"
              />

              <TouchableOpacity
                style={styles.btnEye}
                onPress={this.showPass.bind(this)}
              >
                <Icon
                  name={this.state.press == false ? "md-eye" : "md-eye-off"}
                  size={26}
                  color="rgba(255,255,255, 0.7)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnLogin}>
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>

            <SocialIcon
              title="Sign In With Google"
              button
              type="google"
              onPress={this.signInWithGoogleAsync.bind(this)}
              style={styles.btnGoogle}
              disabled={this.state.isSigninInProgress}
            />
            {/* <GoogleSigninButton
          style={styles.btnGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.signInWithGoogleAsync.bind(this)}
          disabled={this.state.isSigninInProgress}
        /> */}
          </ImageBackground>
        ) : (
          this.props.navigation.navigate("Welcome", {
            displayName: this.state.user.displayName,
            photoURL: this.state.user.photoURL
          })
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50
  },
  logo: {
    width: 120,
    height: 120
  },
  logoText: {
    color: "white",
    fontSize: 20
  },
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: "rgba(0,0,0,0.35)",
    color: "rgba(255,255,255, 0.7)",
    marginHorizontal: 25
  },
  inputIcon: {
    position: "absolute",
    top: 8,
    left: 37
  },
  inputContainer: {
    marginTop: 10
  },
  btnEye: {
    position: "absolute",
    top: 8,
    right: 37
  },
  btnLogin: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#34938D",
    justifyContent: "center",
    marginTop: 20
  },
  text: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "center"
  },
  btnGoogle: {
    width: WIDTH - 55,
    // height: 50,
    height: 45,
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: "#DB4437"
  }
});

export default LoginScreen;
