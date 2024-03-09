import { useEffect } from 'react';
import { StyleSheet, Alert, View, Button, FlatList, Text, Modal } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Folder = ({navigation, route}) => {

    const folder = route.params.folder;

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = `${FileSystem.documentDirectory}/documentP/`+folder;
            const contentFolder = await FileSystem.readDirectoryAsync(
                documentDirectory
            );
            console.log(contentFolder);
           
        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    useEffect(()=>{
        fetchContentInFolder()
    },[]);


    return (
        <View>
            <Text>Ciao</Text>
        </View>
    )
}

export default Folder;