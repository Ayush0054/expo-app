global.Buffer = require("buffer").Buffer;
import React, { useEffect, useState } from "react";
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
import FormData from "form-data";
const Offline = () => {
  const [textInput, setTextInput] = useState("");
  const [imagePath1, setImagePath1] = useState([]);
  const [recording, setRecording] = useState(null);
  const [audioPermission, setAudiPermission] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  useEffect(() => {
    const audioCheck = async () => {
      await Audio.requestPermissionsAsync()
        .then((res) => {
          console.log(res.granted);
          setAudiPermission(res.granted);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    audioCheck();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);
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

  const startRecording = async () => {
    try {
      // Request permission to record audio
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }
      Audio.IOSOutputFormat;
      const newRecording = new Audio.Recording();

      const recordingOptions = {
        ios: {
          extension: ".mp4", // Specify the audio file extension,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH, // Specify the audio quality
        },
        android: {
          extension: ".mp4", // Specify the audio file extension,
        },
      };
      console.log("Starting Recording");
      await newRecording.prepareToRecordAsync(recordingOptions);

      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus("recording");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };
  async function stopRecording() {
    try {
      if (recordingStatus == "recording") {
        console.log("Stopping recording..");
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();
        console.log("Recording stopped and stored at URI", recordingUri);

        // Calls openai translations endpoint
        try {
          const formData = new FormData();
          // FileSystem.readAsStringAsync(recordingUri, {
          //   encoding: FileSystem.EncodingType.Base64,
          // })
          //   .then((content) => {
          //     formData.append("file", content, "test.mp4", {
          //       type: "audio/mp4",
          //     });
          //     // console.log('File content:', content);
          //   })
          //   .catch((error) => {
          //     console.error("Error reading file:", error);
          //   });
          // const base64String = await FileSystem.readAsStringAsync(
          //   recordingUri,
          //   { encoding: FileSystem.EncodingType.Base64 }
          // );
          // const buffer = Buffer.from(base64String, "base64");
          // const blob = new Blob([buffer]);
          const file2 = Buffer.from(
            await FileSystem.readAsStringAsync(recordingUri, {
              encoding: FileSystem.EncodingType.Base64,
            })
            // "string_encoded_as_base_64",
            // "base64"
          );
          const blob = new Blob([file2]);
          const file = new File([blob], "test.mp4", { type: "audio/mp4" });
          // const fileUri = recordingUri.replace("file://", "");
          // const file = {
          //   uri: fileUri,
          //   name: "recording.mp4",
          //   type: "audio/mp4",
          // };
          formData.append("model", "whisper-1");
          formData.append("file", file);
          formData.append("response_format", "text");
          console.log(file);
          const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                // "Content-Type": "multipart/form-data",
              },
              body: formData,
            }
          );
          const body = await response.text();
          console.log(body);
        } catch (error) {
          console.error(error);
        }
        setRecording(null);
        setRecordingStatus("idle");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }
  // Starts/Stops Recording;
  async function handleRecordButtonPress() {
    if (recording) {
      await stopRecording(recording);
    } else {
      await startRecording();
    }
  }
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
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRecordButtonPress} style={styles.button}>
        <Text>Start Recording</Text>
      </TouchableOpacity>
      <Text
        style={{
          color: recordingStatus == "recording" ? "green" : "red",
          marginLeft: 4,
          fontWeight: "800",
        }}
      >{`${recordingStatus}`}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#EBE5FF",
    paddingTop: 40,
    padding: 20,
  },
});
