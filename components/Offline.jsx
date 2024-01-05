// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Image,
//   ImageSourcePropType,
// } from "react-native";
// import { arr, isl_gif } from "./textImage";

// const Offline = () => {
//   const [textInput, setTextInput] = useState("");
//   const [imageSources, setImageSources] = useState([]);

//   const handleTextInput = (text) => {
//     setTextInput(text);
//   };

//   const displayLetterImages = (text) => {
//     return text
//       .split("")
//       .map((char) => {
//         const found = arr.find((item) => item.name === char);
//         return found ? found.value : null;
//       })
//       .filter(Boolean); // Remove nulls
//   };

//   const handleSubmit = () => {
//     console.log("textInput", textInput);

//     if (["goodbye", "good bye", "bye"].includes(textInput)) {
//       console.log("Oops! Time To say good bye");
//       return;
//     }

//     const gifObj = isl_gif.find((item) => item.name === textInput);
//     if (gifObj) {
//       setImageSources([gifObj.value]);
//     } else {
//       const letterImages = displayLetterImages(textInput);
//       setImageSources(letterImages);
//     }
//   };

//   return (
//     <View style={{ margin: 100 }}>
//       <TextInput
//         value={textInput}
//         onChangeText={handleTextInput}
//         placeholder="Enter text"
//       />
//       <TouchableOpacity onPress={handleSubmit}>
//         <Text>Submit</Text>
//       </TouchableOpacity>
//       {imageSources.map((source, index) => (
//         <Image
//           key={index}
//           source={source}
//           style={{ width: 200, height: 200 }}
//         />
//       ))}
//       {/* <Image
//         source={require("assets/images/A.jpg")}
//         style={{ width: 200, height: 200 }}
//       /> */}
//     </View>
//   );
// };

// export default Offline;
import React, { useState } from "react";
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

// import { arr, isl_gif } from "./textImage";

// Adjust the path accordingly

const Offline = () => {
  const [textInput, setTextInput] = useState("");
  const [imagePath1, setImagePath1] = useState([]);
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
      <TextInput
        value={textInput}
        onChangeText={handleTextInput}
        placeholder="Enter text"
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <ScrollView scrollEnabled horizontal={true}>
        {Array.isArray(imagePath1) && imagePath1.length > 0
          ? imagePath1.map((path, index) => (
              <Image
                key={index}
                source={path}
                style={{ width: 300, height: 240, margin: 10 }}
              />
            ))
          : imagePath1 && (
              <Image source={imagePath1} style={{ height: 200, width: 350 }} />
            )}
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
});
