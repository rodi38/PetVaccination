import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { IconButton } from 'react-native-paper';
import { ImageService } from '../services/ImageService';

interface ImagePickerProps {
	imageUrl?: string;
	onImageSelected: (imageUri: string) => void;
	size?: number;
	prefix: string; // Prefixo para o nome do arquivo (ex: última letra do nome)
}

export const ImagePickerComponent: React.FC<ImagePickerProps> = ({ imageUrl, onImageSelected, size = 150, prefix }) => {
	const selectImage = async () => {
		try {
			const result = await launchImageLibrary({
				mediaType: 'photo',
				quality: 0.8,
				maxWidth: 1000,
				maxHeight: 1000,
			});

			if (result.assets && result.assets[0]?.uri) {
				// Salvar imagem localmente
				const savedImagePath = await ImageService.saveImage(result.assets[0].uri, prefix);

				// Notificar componente pai sobre a nova imagem
				onImageSelected(savedImagePath);
			}
		} catch (error) {
			console.error('Error selecting image:', error);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={selectImage}>
				{imageUrl ? (
					<Image source={{ uri: imageUrl }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
				) : (
					<View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
						<IconButton icon='camera' size={size / 3} />
					</View>
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 16,
	},
	image: {
		backgroundColor: '#e1e1e1',
	},
	placeholder: {
		backgroundColor: '#e1e1e1',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
