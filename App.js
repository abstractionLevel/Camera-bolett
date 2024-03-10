import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from "./src/views/folders";
import Folder from './src/views/folder';
import * as MediaLibrary from "expo-media-library";



const Stack = createStackNavigator();


export default function App() {

	useEffect(() => {
		const getPermissions = async () => {
			const { status } = await MediaLibrary.requestPermissionsAsync();

			if (status === "granted") {
				// Save image to media library

				console.log("Image successfully saved");
			}
		};

		getPermissions();
	}, []);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
				<Stack.Screen name="Folder" component={Folder} options={{ title: 'Folder' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);

}

