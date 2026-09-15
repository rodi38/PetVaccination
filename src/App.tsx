import React from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './contexts/AuthContext';
import { Routes } from './routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const theme = {
	colors: {
		...DefaultTheme.colors,
		primary: '#2e7d32',
		accent: '#81c784',
	},
};

const renderIcon = (props: React.ComponentProps<typeof MaterialCommunityIcons>) => <MaterialCommunityIcons {...props} />;

const App = () => {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={styles.root}>
				<PaperProvider
					theme={theme}
					settings={{
						icon: renderIcon,
					}}
				>
					<AuthProvider>
						<Routes />
					</AuthProvider>
					<Toast />
				</PaperProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});

export default App;
