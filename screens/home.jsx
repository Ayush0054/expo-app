import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../assets/disab.png")} />
      <Text style={styles.headingText}>Disability Bridge</Text>
      <TouchableOpacity
        title="start application"
        onPress={() => navigation.navigate("offline")}
        style={styles.button}
      >
        <Text style={styles.btntxt}>Start → </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btntxt: {
    fontSize: 20,
    alignItems: "center",
  },
  headingText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
    // flex: 1,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#9f75ff",
    padding: 20,
    borderRadius: 10,
    // elevation: true,
    shadowOffset: 5,
    shadowColor: "#dddd",
    margin: 20,
  },
  img: {
    margin: 50,

    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: 300,
    width: 300,
  },
  container: {
    flex: 1,
    backgroundColor: "#EBE5FF",

    alignItems: "center",
  },
});
