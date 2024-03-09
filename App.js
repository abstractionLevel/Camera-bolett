import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from "./src/views/folders";
import Folder from './src/views/folder';

const Stack = createStackNavigator();


export default function App() {

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
				<Stack.Screen name="Folder" component={Folder} options={{ title: 'Folder' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);

}

