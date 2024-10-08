import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const favicon = require("../assets/images/Favicon.png");
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../FIrebaseConfig";
import { signOut } from "firebase/auth";

const NavBar = ({ userInfo }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigation = useNavigation();

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  const { width } = useWindowDimensions();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleNavigation = () => {
    setNotificationVisible(!notificationVisible);
  };

  const handleProfile = () => {
    toggleDropdown();
    navigation.navigate("Profile");
  };

  const handleSettings = () => {
    toggleDropdown();
    navigation.navigate("Settings");
  };

  const handleHelpCenter = () => {
    toggleDropdown();
    navigation.navigate("HelpCenter");
  };

  const handleAppInfo = () => {
    toggleDropdown();
    navigation.navigate("AppInfo");
  };

  const handleRateApp = () => {
    toggleDropdown();
    navigation.navigate("RateTheApp");
  };

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut(auth);
      console.log("User signed out!");

      navigation.reset({
        index: 0,
        routes: [{ name: "SignUp" }],
      });

      setDropdownVisible(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={[styles.NavTop, { position: "relative" }]}>
      <Image style={styles.favIcon} source={favicon} />
      <View style={styles.cornerIcons}>
        <TouchableOpacity onPress={toggleNavigation} style={styles.Icon}>
          <Ionicons name="notifications-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Icon}>
          <Ionicons name="sunny-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDropdown}>
          <Image
            style={styles.favIcon}
            source={{
              uri: "https://img.freepik.com/free-photo/portrait-fair-haired-woman-with-warm-blue-eyes-dry-lips-healthy-skin-looking-directly-alluring-girl-with-beautiful-appearance-dressed-casually-posing_273609-7635.jpg",
            }}
          />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            onPress={handleProfile}
            style={styles.userContainer}
          >
            <Ionicons name="person-circle" size={30} color="black" />
            <Text style={[styles.userName, { fontFamily: "Poppins-Bold" }]}>
              {userInfo && userInfo.length > 0
                ? `${userInfo[0].name} ${userInfo[0].surname}`
                : "User"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={handleSettings}
          >
            <Ionicons name="settings-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={handleHelpCenter}
          >
            <Ionicons name="help-circle-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              Help Center
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleAppInfo}>
            <Ionicons name="information-circle-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              App Information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleRateApp}>
            <Ionicons name="star-half-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              Rate The App
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notificationVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownItem}>
            <Ionicons name="notifications-outline" />
            <Text
              style={[styles.dropdownText, { fontFamily: "Poppins-Regular" }]}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
export default NavBar;

const styles = StyleSheet.create({
  NavTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    zIndex: 1000,
  },
  cornerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 170,
  },
  favIcon: {
    width: 50,
    height: 50,
    borderRadius: 99,
  },
  Icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 99,
  },
  dropdownMenu: {
    marginTop: 30,
    position: "absolute",
    top: 70,
    padding: 18,
    right: 10,
    width: 220,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
  },
});
