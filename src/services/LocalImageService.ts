import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export class ImageService {
  static readonly IMAGE_DIR = 
    Platform.OS === 'ios' 
      ? `${RNFS.DocumentDirectoryPath}/pet_vaccination_images`
      : `${RNFS.ExternalDirectoryPath}/pet_vaccination_images`;

  static async initializeImageDirectory() {
    try {
      // Verifica se o diretório existe, se não, cria
      const exists = await RNFS.exists(this.IMAGE_DIR);
      if (!exists) {
        await RNFS.mkdir(this.IMAGE_DIR);
      }
    } catch (error) {
      console.error('Error initializing image directory:', error);
      throw error;
    }
  }

  static async saveImage(imageUri: string, prefix: string): Promise<string> {
    try {
      // Criar nome único para o arquivo
      const timestamp = new Date().getTime();
      const extension = imageUri.split('.').pop();
      const fileName = `${prefix}-${timestamp}.${extension}`;
      const destPath = `${this.IMAGE_DIR}/${fileName}`;

      // Copiar imagem para o diretório do app
      await RNFS.copyFile(imageUri, destPath);

      // Retornar o caminho relativo da imagem
      return `file://${destPath}`;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  static async deleteImage(imagePath: string) {
    try {
      if (imagePath && await RNFS.exists(imagePath)) {
        await RNFS.unlink(imagePath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Método para converter URI da imagem para caminho de arquivo local
  static getLocalPath(uri: string): string {
    return uri.replace('file://', '');
  }
}