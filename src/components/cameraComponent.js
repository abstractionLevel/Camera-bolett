import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import SetFileNameModal from '../modal/setNameFileModal';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FOLDERS_DIRECTORY_PATH } from '../../constant/constants';

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
            const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + fileName;
            try {
             

                await FileSystem.moveAsync({
                    from: capturedImage,
                    to: directoryTo
                });
            } catch (error) {
                console.error('Errore durante il salvataggio dell\'immagine:', error);
            }
        }
    };

    const closeModalCamera = () => {
        setIsModalVisible(false);
        onClose();
    }

    return (
        <View style={styles.container}>
            {capturedImage && (
                <View style={styles.imagePreview}>
                    <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapper}>
                            <Button title="Salva Immagine" onPress={() => setIsModalVisible(true)} style={styles.button} />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <Button title="Annulla" onPress={onClose} style={styles.button} />
                        </View>
                    </View>
                </View>
            )}
            {!capturedImage && (
                <View style={styles.cameraView} >
                    <View style={{ height: '10%', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={onClose} style={{ marginTop: 30, marginRight: 20 }}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.back}
                        ref={ref => setCameraRef(ref)}
                    />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Button title="Scatta Foto" onPress={takePicture} /> */}
                        <Feather name="circle" size={64} color="black" onPress={takePicture} />
                    </View>
                </View>
            )}
            <SetFileNameModal
                visible={isModalVisible}
                onClose={closeModalCamera}
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
        height: '80%'
    },
    buttonContainer: {
        flexDirection: 'row', // Disposizione orizzontale dei bottoni
        justifyContent: 'space-between', // Spazio uniforme tra i bottoni
        paddingHorizontal: 20, // Aggiunge spazio ai lati per evitare che i bottoni siano troppo vicini ai bordi
    },
    buttonWrapper: {
        flex: 1, // Fa sì che entrambi i bottoni occupino lo stesso spazio
        marginHorizontal: 5
    },
    button: {
        width: '100%', // Larghezza fissa per entrambi i bottoni
    },
    imagePreview: {
        marginTop: 40,
        flex: 1,
    },
    previewImage: {
        height:'90%',
        marginBottom: 10,
    },
});

export default CameraComponent;
