import { StyleSheet, Alert, View, Button, FlatList, Text, Modal } from 'react-native';

const Folder = ({navigation, route}) => {

    console.log(route.params.folder)
    return (
        <View>
            <Text>Ciao</Text>
        </View>
    )
}

export default Folder;