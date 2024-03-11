import { StyleSheet, View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import CreateFolderModal from '../createFolderModal';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import RenameFolderModal from '../modal/renameFolderModal';
import { FOLDERS_DIRECTORY_PATH } from '../../constant/constants';


const Folders = ({ navigation }) => {

    const [folders, setFolders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateView, setUpdateView] = useState(false);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);
    const [isModalRename,setIsModalRename] = useState(null);
    const [currentFolder,setCurrentFolder] = useState(null);

    const handleCreateFolder = async (folderName) => {
        try {
            const folderPath = FOLDERS_DIRECTORY_PATH + folderName;
            setUpdateView(true);
            await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
        } catch (error) {
            console.error('Errore durante la creazione della cartella:', error);
        }
    };

    const checkAndCreateFolder = async () => {
        try {
            const documentPFolderExists = await FileSystem.getInfoAsync(FOLDERS_DIRECTORY_PATH);
            if (!documentPFolderExists.exists) {
                await FileSystem.makeDirectoryAsync(FOLDERS_DIRECTORY_PATH,{ intermediates: true });
            } else {

                fetchFolders();
            }

        } catch (error) {
            console.error('Errore durante il controllo/creazione della cartella:', error);
        }
    };

    const fetchFolders = async () => {
        try {
            const documentPDirectory = FOLDERS_DIRECTORY_PATH;
            const documentPFolders = await FileSystem.readDirectoryAsync(
                documentPDirectory
            );
            setFolders(documentPFolders);
        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };


    const onPressHeadMenu = (item) => {
        setCurrentFolder(item);
        setVisibleHeadMenu(true);
    }

    const renderFolder = ({ item }) => (
        <TouchableOpacity onLongPress={() => onPressHeadMenu(item)} onPress={() => navigation.navigate("Folder", { folder: item })}>
            <View style={styles.folders}>
                <Entypo style={{ marginLeft: 10 }} name="folder" size={24} color="#1E90FF" />
                <Text style={{ marginLeft: 10 }} >{item}</Text>
            </View>
        </TouchableOpacity>
    )

    useEffect(() => {
        checkAndCreateFolder();
    }, []);

    useEffect(() => {
        fetchFolders();
        setUpdateView(false);
    }, [updateView]);

    useEffect(() => {
        fetchFolders();
        if(!isModalRename) setVisibleHeadMenu(false);
    }, [isModalRename]);
    

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            {visibleHeadMenu &&
                <View style={styles.headMenu}>
                    <View>
                        <TouchableOpacity onPress={() => setVisibleHeadMenu(false)}>
                            <AntDesign name="left" size={32} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="edit" size={32} color="black" style={{ marginRight: 20 }} onPress={()=>setIsModalRename(true)} />
                        <FontAwesome6 name="trash" size={32} color="black" style={{ marginRight: 20 }} />
                    </View>
                </View>
            }

            {folders.length > 0 ? (
                <View >
                    <FlatList
                        data={folders}
                        renderItem={renderFolder}
                        vertical={true}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View style={{ width: '100%', alignItems: 'center', marginTop: 100 }}>
                        <View style={{ width: '50%' }}>
                            <Button style={{ with: 20 }} title="Crea Cartella" onPress={() => setIsModalVisible(!isModalVisible)} />
                        </View>
                    </View>
                    <CreateFolderModal
                        visible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        onCreateFolder={handleCreateFolder}
                    />
                </View>
            ) : (
                <></>
            )}
            <RenameFolderModal
                visible={isModalRename}
                onClose={() => setIsModalRename(false)}
                folder={currentFolder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    folders: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    headMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    }
});

export default Folders;
