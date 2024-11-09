import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './contexts/AuthContext';
import { Routes } from './routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme = {
	colors: {
		...DefaultTheme.colors,
		primary: '#2e7d32',
		accent: '#81c784',
	},
};

const App = () => {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<PaperProvider
					theme={theme}
					settings={{
						icon: (props) => <MaterialCommunityIcons {...props} />,
					}}
				>
					<AuthProvider>
						<Routes />
					</AuthProvider>
				</PaperProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

export default App;
