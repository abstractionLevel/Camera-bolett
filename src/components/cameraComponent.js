import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraComponent = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    const takePicture = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        if (status === 'granted') {
            if (cameraRef) {
                let photo = await cameraRef.takePictureAsync();
                console.log('Foto catturata:', photo);
                // Qui puoi gestire la foto catturata, ad esempio mostrare l'immagine in un'anteprima
            }
        } else {
            console.log('Accesso alla fotocamera non consentito');
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={ref => setCameraRef(ref)}
            />
            <Button title="Scatta Foto" onPress={takePicture} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
    },
});

export default CameraComponent;
