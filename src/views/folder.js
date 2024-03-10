import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;

    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = `${FileSystem.documentDirectory}/documentP/` + folder;
            const contentFolder = await FileSystem.readDirectoryAsync(
                documentDirectory
            );
            setImages(contentFolder);
            console.log("content of folder   ", contentFolder)

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
                <View style={{ flex: 1 }}>
                    <CameraComponent folder={folder} onClose={() => setOpenCamera(false)} />
                </View>
            ) : (
                <View>
                    <View style={{ width: '100%', alignItems: 'center', marginTop: 100 }}>
                        <FlatList
                            data={images}
                            renderItem={(item)=><Text>{item.item}</Text>}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ width: '50%' }}>
                            <Button style={{ with: 20 }} title="Apri Camera" onPress={() => setOpenCamera(true)} />
                        </View>
                    </View>
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