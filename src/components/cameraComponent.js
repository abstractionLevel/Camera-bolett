import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import SetFileNameModal from '../modal/setNameFileModal';
import * as ImageManipulator from 'expo-image-manipulator';

const CameraComponent = ({ folder, onClose }) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const takePicture = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            if (cameraRef) {
                let photo = await cameraRef.takePictureAsync();

                setCapturedImage(photo.uri);
            }
        } else {
            console.log('Accesso alla fotocamera non consentito');
        }
    };

    const saveImageHandler = async (fileName) => {
        if (capturedImage) {
            try {
                await FileSystem.moveAsync({
                    from: capturedImage,
                    to: `${FileSystem.documentDirectory}documentP/${folder}/${fileName}.jpg`
                });
            } catch (error) {
                console.error('Errore durante il salvataggio dell\'immagine:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {capturedImage && (
                <View style={styles.imagePreview}>
                    <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                    <View style={styles.buttonContainer}>
                        <Button title="Salva Immagine" onPress={()=>setIsModalVisible(true)} />
                        <Button title="Annulla" onPress={onClose} />
                    </View>
                </View>
            )}
            {!capturedImage && (
                <View style={styles.cameraView} >
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.back}
                        ref={ref => setCameraRef(ref)}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Scatta Foto" onPress={takePicture} />
                        <Button title="Chiudi Fotocamera" onPress={onClose} />
                    </View>
                </View>
            )}
            <SetFileNameModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSetFileName={saveImageHandler}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    cameraView: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    imagePreview: {
        flex: 1,
    },
    previewImage: {
        flex: 1,
        marginBottom: 10,
    },
});

export default CameraComponent;
