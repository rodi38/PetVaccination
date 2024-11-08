import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal, Text } from 'react-native-paper';

interface LoadingOverlayProps {
	visible: boolean;
	text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, text = 'Loading...' }) => {
	if (!visible) {
		return null;
	}

	return (
		<Portal>
			<View style={styles.container}>
				{/* <View style={styles.content}> */}
				<ActivityIndicator size='large' color='#2e7d32' />
				{/* <Text style={styles.text}>{text}</Text> */}
				{/* </View> */}
			</View>
		</Portal>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 9999,
	},
	content: {
		backgroundColor: 'none',
		padding: 0,
		borderRadius: 0,
		alignItems: 'center',
		elevation: 5,
	},
	text: {
		marginTop: 10,
		color: '#2e7d32',
	},
});
