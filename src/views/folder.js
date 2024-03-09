import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;

    const [openCamera, setOpenCamera] = useState(false);

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = `${FileSystem.documentDirectory}/documentP/` + folder;
            const contentFolder = await FileSystem.readDirectoryAsync(
                documentDirectory
            );

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    useEffect(() => {
        fetchContentInFolder()
    }, []);

    return (
        <View style={styles.container}>
            {openCamera ? (
                <View style={{flex:1}}>
                    <CameraComponent />
                </View>
            ) : (
                <View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
    },
});

export default Folder;