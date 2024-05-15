import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, Platform, View, Button, Text } from 'react-native';
import { Camera } from 'expo-camera'; // Correct import for Camera as a type
import Ionicons from '@expo/vector-icons/Ionicons';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<typeof Camera | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
      setIsCameraActive(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="Camera">
        <ThemedText>
          Use the camera to take pictures directly within the app.
        </ThemedText>
        {isCameraActive ? (
          <View style={styles.cameraContainer}>
            {/* Correctly using Camera component in JSX */}
            <Camera style={styles.camera} ref={cameraRef} />
            <View style={styles.buttonContainer}>
              <Button title="Take Picture" onPress={takePicture} />
              <Button title="Close Camera" onPress={() => setIsCameraActive(false)} />
            </View>
          </View>
        ) : (
          <Button title="Open Camera" onPress={() => setIsCameraActive(true)} />
        )}
        {photo && (
          <Image source={{ uri: photo }} style={styles.preview} />
        )}
      </Collapsible>
      {/* ...other Collapsible components */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 400,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});