import React, { useState } from "react";
import axios from "axios";
import { Audio } from "expo-av";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { arr, isl_gif } from "../textImage";
import * as FileSystem from "expo-file-system";
const Offline = () => {
  const [textInput, setTextInput] = useState("");
  const [imagePath1, setImagePath1] = useState([]);
  const [recording, setRecording] = useState(null);
  const handleTextInput = (text) => {
    console.log("text", text);
    setTextInput(text);
  };

  const displayLetterImages = (text) => {
    const imagePaths = [];

    for (let i = 0; i < text.length; i++) {
      const letterObj = arr.find((item) => item.name === text[i]);
      if (letterObj) {
        imagePaths.push(letterObj.value);
      }
    }
    return imagePaths;
  };
  const handleAudioRecording = async () => {
    // Code to start recording and get audio data
    const audioData = await recordAudio(); // Implement this function

    // Send audio data to the backend
    fetch("http://localhost:5000/speech-to-text", {
      method: "POST",
      body: JSON.stringify({ audioData: audioData }),
      // headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setTextInput(data.text); // Update the text input with the transcribed text
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const startRecording = async () => {
    try {
      // Request permission to record audio
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        // Setting up audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Starting recording
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        console.log("Permission to record not granted");
      }
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    // Convert the recording to a base64 string and send it to the server
    FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    })
      .then((base64Audio) => sendAudioToServer(base64Audio))
      .catch((error) => console.error("Error reading audio file", error));
  };

  const sendAudioToServer = async (base64Audio) => {
    try {
      const response = await axios.post("http://localhost:5000/speechText", {
        audioData: base64Audio, // Send the base64 audio data directly
      });
      console.log(response.data);
      setTextInput(response.data.text); // Update the text input with the transcribed text
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSubmit = () => {
    if (
      textInput === "goodbye" ||
      textInput === "good bye" ||
      textInput === "bye"
    ) {
      console.log("Oops! Time To say good bye");
      return;
    }
    console.log("textInput", textInput);
    const gifObj = isl_gif.find((item) => item.name === textInput);
    if (gifObj) {
      setImagePath1([gifObj.value]);
    } else {
      const letterImages = displayLetterImages(textInput);
      setImagePath1(letterImages);
    }
  };

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text style={styles.headingText}>Disability Bridge</Text>
      <TouchableOpacity onPress={startRecording} style={styles.button}>
        <Text>Start Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopRecording} style={styles.button}>
        <Text>Stop Recording</Text>
      </TouchableOpacity>
      <TextInput
        value={textInput}
        onChangeText={handleTextInput}
        placeholder="Enter text"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <ScrollView scrollEnabled horizontal={true}>
        {Array.isArray(imagePath1) && imagePath1.length > 0
          ? imagePath1.map((path, index) => (
              <Image
                key={index}
                source={path}
                style={{
                  width: 300,
                  height: 240,
                  margin: 10,
                  backgroundColor: "#d9ceff",
                  padding: 10,
                }}
              />
            ))
          : imagePath1 && <Image source={imagePath1} style={{ height: 250 }} />}
      </ScrollView>
    </View>
  );
};

export default Offline;
const styles = StyleSheet.create({
  headingText: {
    fontSize: 24,
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
    padding: 10,
    borderRadius: 10,
    // elevation: true,
    shadowOffset: 5,
    shadowColor: "#dddd",
    margin: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
