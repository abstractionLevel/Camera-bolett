import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from "./src/views/folders";


export default function App() {

	const Stack = createStackNavigator();

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
				{/* <Stack.Screen name="Folder" component={FolderScreen} options={{ title: 'Folder' }} /> */}
			</Stack.Navigator>
		</NavigationContainer>
	);

}

