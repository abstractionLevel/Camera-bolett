import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';
import { AntDesign } from '@expo/vector-icons';
import FullScreenImageModal from '../modal/fullScreenImageModal';


const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;

    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(null);
    const [imageClicked, setImageClicked] = useState(null);

    const hideHeader = () => {
        navigation.setParams({ showHeader: false }); // Imposta i parametri della route per nascondere l'header
    };

    const showHeader = () => {
        navigation.setParams({ showHeader: true }); // Imposta i parametri della route per mostrare l'header
    };

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = `${FileSystem.documentDirectory}/documentP/` + folder;
            const contentFolder = await FileSystem.readDirectoryAsync(
                documentDirectory
            );
            contentFolder.push("add");
            setImages(contentFolder);

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const renderPictures = ({ item }) => {
        if (item === "add") {
            return (
                <TouchableOpacity onPress={() => setOpenCamera(true)}>
                    <AntDesign style={{ marginLeft: 40, marginTop: 24 }} name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            )
        }
        return (
            <View   >
                <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => { setOpenImageModal(true); setImageClicked(`${FileSystem.documentDirectory}documentP/${folder}/` + item) }}>
                    <Image source={{ uri: `${FileSystem.documentDirectory}documentP/${folder}/` + item }} style={{ width: 80, height: 80, borderRadius: 10, marginTop: 20 }} />
                    <Text>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    useEffect(() => {
        fetchContentInFolder()
        navigation.setParams({ title: folder }); // Imposta il titolo dei parametri della route per il nuovo titolo

    }, []);

    useEffect(() => {
        openCamera ? hideHeader() : showHeader();

        fetchContentInFolder()
    }, [openCamera]);

    return (
        <View style={styles.container}>
            {openCamera ? (
                <View style={{ flex: 1 }}>
                    <CameraComponent folder={folder} onClose={() => setOpenCamera(false)} />
                </View>
            ) : (
                <View>
                    <View style={{ width: '100%', marginTop: 40 }}>
                        <FlatList
                            data={images}
                            renderItem={renderPictures}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                        />
                    </View>
                </View>
            )}
            <FullScreenImageModal isVisible={openImageModal} pathImage={imageClicked} onClose={() => setOpenImageModal(false)} />
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