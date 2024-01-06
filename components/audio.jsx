// Import statements
import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

const audioRecorderPlayer = new AudioRecorderPlayer();

const Audio = () => {
  const [recordedAudio, setRecordedAudio] = useState("");

  const onStartRecord = async () => {
    const uri = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      // Update state if needed
    });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordedAudio(result);
    // send audio to server
    sendAudioToServer(result);
  };

  const sendAudioToServer = async (audioPath) => {
    // Convert audio file to base64 or required format
    // Send it to the Node.js server
    fetch("http://localhost:5000/speech-to-text", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio: audioBase64, // replace with your base64 audio data
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.text); // Transcribed text
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <TouchableOpacity onPress={onStartRecord}>
        <Text>Start Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStopRecord}>
        <Text>Stop Recording</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Audio;
