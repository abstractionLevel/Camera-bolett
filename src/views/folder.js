import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';
import { AntDesign, FontAwesome6, Entypo } from '@expo/vector-icons';
import FullScreenImageModal from '../modal/fullScreenImageModal';
import RenameFileModal from '../modal/renameFileModal';
import DeleteFileModal from '../modal/deleteFileModal';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';
import { getUniqueDatesFromArray } from '../utils/date';

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;

    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(null);
    const [imageClicked, setImageClicked] = useState(null);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);
    const [isModalRename, setIsModalRename] = useState(null);
    const [isModalDelete, setIsModalDelete] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    const hideHeader = () => {
        navigation.setParams({ showHeader: false });
    };

    const showHeader = () => {
        navigation.setParams({ showHeader: true });
    };

    const mockFetch = () => {
        const mock = [
            { "date": "11/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "9/3/2024", "name": "Casa " },
            { "date": "8/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " },
            { "date": "10/3/2024", "name": "Casa " }
        ]

        groupedFotoByDate(mock);
    }

    const groupedFotoByDate = (resp) => {
        const uniqueDate = getUniqueDatesFromArray(resp);
        let groupedPicture = [];
        uniqueDate.forEach(date => {//per ogni data
            const dateGroup = { date: date, image: [] };//setto la prima data
            resp.forEach(item => {//itero l array d immagini
                if (date === item.date) {
                    dateGroup.image.push(item.name);//setto l immagine che combacia con la data
                }
            });
            groupedPicture.push(dateGroup);
        });
        groupedPicture.sort((a, b) => {
            if(a.date && b.date) {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return  dateB - dateA;
            }
           

        });
        setImages(groupedPicture);
    }

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = FOLDERS_DIRECTORY_PATH + folder;
            const contentFolder = await FileSystem.readDirectoryAsync(documentDirectory);
            let contents = [];
            for (const item of contentFolder) {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(FOLDERS_DIRECTORY_PATH + folder + '/' + item);
                    const date = new Date(fileInfo.modificationTime * 1000);
                    const formattedDate = date.toLocaleDateString();
                    if (item) {
                        contents.push({
                            name: item,
                            date: formattedDate
                        })
                    }
                } catch (error) {
                    console.error('Errore durante il recupero delle informazioni del file:', error);
                }
            }
            contents.push({ name: "add" })
            groupedFotoByDate(contents);

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const onPressHeadMenu = (item) => {
        setVisibleHeadMenu(true);
        setCurrentFile(item);
    }

    const renderImage = ({ item }) => {
        if (item === "add") {
            return (
                <TouchableOpacity style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => setOpenCamera(true)}>
                    <AntDesign name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={{ padding: 2 }} onLongPress={() => onPressHeadMenu(item)} onPress={() => { setOpenImageModal(true); setImageClicked(FOLDERS_DIRECTORY_PATH + folder + "/" + item) }}>
                    <Image source={{ uri: FOLDERS_DIRECTORY_PATH + folder + "/" + item }} style={{ width: 100, height: 100, borderRadius: 10, padding: 0 }} />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center' }}>{item}</Text>
                </TouchableOpacity>
            )
        }

    }

    const renderItem = ({ item }) => (
        <View>
            <Text style={styles.date}>{item.date}</Text>
            <FlatList
                data={item.image}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
            />
        </View>
    )



    useEffect(() => {
        fetchContentInFolder()
        navigation.setParams({ title: folder });

    }, []);

    useEffect(() => {
        openCamera ? hideHeader() : showHeader();

        fetchContentInFolder()
    }, [openCamera]);

    useEffect(() => {
        visibleHeadMenu ? hideHeader() : showHeader();
    }, [visibleHeadMenu])

    useEffect(() => {
        fetchContentInFolder();
        if (!isModalRename) setVisibleHeadMenu(false);
    }, [isModalRename, isModalDelete]);

    return (
        <View style={styles.container}>
            {visibleHeadMenu &&
                <View style={styles.headMenu}>
                    <View>
                        <TouchableOpacity onPress={() => setVisibleHeadMenu(false)}>
                            <AntDesign name="left" size={32} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="edit" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalRename(true)} />
                        <FontAwesome6 name="trash" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalDelete(true)} />
                    </View>
                </View>
            }

            {openCamera ? (
                <View style={{ flex: 1 }}>
                    <CameraComponent folder={folder} onClose={() => setOpenCamera(false)} />
                </View>
            ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', width: '90%' }}>
                        <View style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
                            <FlatList
                                data={images}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>
            )}
            <FullScreenImageModal
                isVisible={openImageModal}
                pathImage={imageClicked} onClose={() => setOpenImageModal(false)}
            />
            <RenameFileModal
                visible={isModalRename}
                onClose={() => setIsModalRename(false)}
                file={currentFile}
                folder={folder}
            />
            <DeleteFileModal
                visible={isModalDelete}
                onClose={() => setIsModalDelete(false)}
                folder={folder}
                file={currentFile}
            />
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
        marginBottom: 20,
    },
    headMenu: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    date: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
});

export default Folder;