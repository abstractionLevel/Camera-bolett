import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';
import { AntDesign } from '@expo/vector-icons';


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
            contentFolder.push("add");
            setImages(contentFolder);
            console.log("content of folder   ", contentFolder)

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const renderPictures = ({ item }) => {
        if (item === "add") {
            return (
                <TouchableOpacity onPress={() => setOpenCamera(true)}>
                    <AntDesign style={{ marginLeft: 22, marginTop: 24 }} name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>

            )

        }
        return <Image source={{ uri: `${FileSystem.documentDirectory}documentP/${folder}/` + item }} style={{ marginLeft: 10, width: 80, height: 80, borderRadius: 10 }} />

    }

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
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <FlatList
                            data={images}
                            renderItem={renderPictures}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    camera: {
        flex: 1,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20, // Spazio tra il bottone e il contenuto sopra
    },
});

export default Folder;