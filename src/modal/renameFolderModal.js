import React, { useEffect, useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';

const RenameFolderModal = ({ visible, onClose, folder }) => {

    const [folderName, setFolderName] = useState(null);

    const handleRenameFolder = async () => {
        await FileSystem.moveAsync({
            from: FOLDERS_DIRECTORY_PATH + '/' + folder, // Percorso della directory da rinominare
            to: FOLDERS_DIRECTORY_PATH + '/' + folderName, // Nuovo percorso con il nuovo nome
        });
        setFolderName(null);
        onClose();

    }

    const onCloseModal = () => {
        setFolderName(null);
        onClose();
    }

    useEffect(() => {
        if (folder !== null) {
            setFolderName(folder);
        }
    }, [folder]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome del file"
                        value={folderName}
                        onChangeText={setFolderName}
                    />
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Fatto" onPress={handleRenameFolder} />
                        </View>
                        <View style={styles.button}>
                            <Button title="Annulla" onPress={() => onCloseModal()} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5, // Aggiungi spaziatura tra i pulsanti se necessario
    },
});

export default RenameFolderModal;