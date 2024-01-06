import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Offline from "./components/Offline";

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Offline />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBE5FF",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
