import React, { useState, useEffect, useContext } from "react"; // Import useContext
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../FIrebaseConfig";
import { UserContext } from "../context/UserContext";

const { width } = Dimensions.get("window");

const LoginForm = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const { width } = useWindowDimensions();

  const togglePassword = () => setSeePassword(!seePassword);
  const passwordVisibility = () => {
    togglePassword();
    setSecureText(!secureText);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      // Other font loads...
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");
    } catch (error) {
      console.log("Error @Onboarding: ", error);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Dashboard");
      }
    });
    return () => unsub();
  }, [auth, navigation]);

  const handleAuthentication = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from your database (assumed to be Firestore)
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = { ...userDoc.data(), uid: user.uid };
        console.log("User data fetched from Firestore: ", userData);
      }

      navigation.navigate("Welcome");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.PasswordEntryBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
            style={styles.eyeIcon}
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuthentication}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </View>
      <TouchableOpacity
        style={styles.clearOnboarding}
        onPress={clearOnboarding}
      >
        <Text style={styles.loginText}>Clear Onboarding</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 30,
  },
  logo: {
    height: 120,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
    fontFamily: "Poppins-Bold",
  },
  headerSubtitle: {
    width: width - 40,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: "Poppins-Regular", // Apply font to TextInput
  },
  loginButton: {
    width: width - 40,
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  loginText: {
    fontFamily: "Poppins-Bold",
    color: "white",
    fontSize: 16,
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: "#B7C42E",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  forgotPassword: {
    marginRight: width - 220,
    marginBottom: 20,
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
    marginLeft: -80,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  PasswordEntryBox: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 15,
    fontFamily: "Poppins-Regular",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  socialButtonsContainer: {
    marginTop: 20, // Adjusted from 5%
  },
  socialButton: {
    marginBottom: 15, // Adjusted from 5%
  },
  socialButtonText: {
    color: "#B7C42E",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  buttonText: {
    fontFamily: "Poppins-Regular",
  },
  clearOnboarding: {
    backgroundColor: "#B7C42E",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default LoginForm;
