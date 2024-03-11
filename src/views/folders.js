import { StyleSheet, View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import CreateFolderModal from '../createFolderModal';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';


const Folders = ({ navigation }) => {

    const [folders, setFolders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateView, setUpdateView] = useState(false);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);

    const handleCreateFolder = async (folderName) => {
        try {
            // Path della nuova cartella
            const folderPath = `${FileSystem.documentDirectory}/documentP/` + folderName;
            // Creazione della cartella
            setUpdateView(true);
            await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
        } catch (error) {
            console.error('Errore durante la creazione della cartella:', error);
        }
    };

    const checkAndCreateFolder = async () => {
        try {
            const documentPFolderExists = await FileSystem.getInfoAsync(
                `${FileSystem.documentDirectory}/documentP`
            );
            if (!documentPFolderExists.exists) {
                await FileSystem.makeDirectoryAsync(
                    `${FileSystem.documentDirectory}/documentP`,
                    { intermediates: true }
                );
            } else {

                fetchFolders();
            }

        } catch (error) {
            console.error('Errore durante il controllo/creazione della cartella:', error);
        }
    };

    const fetchFolders = async () => {
        try {
            const documentPDirectory = `${FileSystem.documentDirectory}/documentP`;
            const documentPFolders = await FileSystem.readDirectoryAsync(
                documentPDirectory
            );
            setFolders(documentPFolders);
        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const handleLongPress = () => {
        // Apri il menu con le opzioni
        console.log('Apri il menu con le opzioni per:', item);
    };

    const onPressHeadMenu = (item) => {
        console.log("item ", item)
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

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            {visibleHeadMenu &&
                <View style={styles.headMenu}>
                    <View>
                        <AntDesign name="left" size={32} color="black" />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="edit" size={32} color="black" style={{ marginRight: 20 }} />
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
        backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    }
});

export default Folders;
