import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import CameraComponent from '../components/cameraComponent';
import { AntDesign,FontAwesome6 ,Entypo} from '@expo/vector-icons';
import FullScreenImageModal from '../modal/fullScreenImageModal';
import RenameFileModal from '../modal/renameFileModal';

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;

    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(null);
    const [imageClicked, setImageClicked] = useState(null);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);
    const [isModalRename, setIsModalRename] = useState(null);
    const [isModalDelete, setIsModalDelete] = useState(null);
    const [currentFile,setCurrentFile] = useState(null);
 
    const hideHeader = () => {
        navigation.setParams({ showHeader: false }); 
    };

    const showHeader = () => {
        navigation.setParams({ showHeader: true });
    };

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = `${FileSystem.documentDirectory}/documentP/` + folder;
            const contentFolder = await FileSystem.readDirectoryAsync(
                documentDirectory
            );
            let cpyContent = [];
            contentFolder.push("add");
            contentFolder.forEach(item=>{
                cpyContent.push(item.trim())
            })
            setImages(contentFolder);

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const onPressHeadMenu = (item) => {
        setVisibleHeadMenu(true);
        setCurrentFile(item);
    }

    const renderPictures = ({ item }) => {
        
        if (item === "add") {
            return (
                <TouchableOpacity style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => setOpenCamera(true)}>
                    <AntDesign name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={{ padding: 2 }} onLongPress={() => onPressHeadMenu(item)} onPress={() => { setOpenImageModal(true); setImageClicked(`${FileSystem.documentDirectory}documentP/${folder}/` + item) }}>
                    <Image source={{ uri: `${FileSystem.documentDirectory}documentP/${folder}/` + item }} style={{ width: 100, height: 100, borderRadius: 10, padding:0}} />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center' }}>{item}</Text>
                </TouchableOpacity>
            )
        }
      
    }


    useEffect(() => {
        fetchContentInFolder()
        navigation.setParams({ title: folder });

    }, []);

    useEffect(() => {
        openCamera ? hideHeader() : showHeader();

        fetchContentInFolder()
    }, [openCamera]);

    useEffect(()=>{
        visibleHeadMenu ? hideHeader() : showHeader();
    },[visibleHeadMenu])

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
                                renderItem={renderPictures}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={3}
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
        marginTop:60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    }
});

export default Folder;