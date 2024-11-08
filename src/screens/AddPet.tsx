import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {AddPetScreenProps} from '../types/navigation';
import api from '../services/api';
import {useAuth} from '../contexts/AuthContext';

export const AddPet: React.FC<AddPetScreenProps> = ({navigation}) => {
  const {user} = useAuth(); // Pegando o usuário do contexto de autenticação

  const [name, setName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validações básicas
      if (!name || !petType || !breed || !gender || !age) {
        setError('Please fill all fields');
        return;
      }

      const ageNumber = parseInt(age);
      if (isNaN(ageNumber) || ageNumber < 0) {
        setError('Please enter a valid age');
        return;
      }

      const petData = {
        name,
        petType,
        breed,
        gender,
        age: ageNumber,
        owner: user?._id,
      };

      console.log(petData);

      await api.post('/pets', petData);
      navigation.navigate('Home');
    } catch (err) {
      console.error('Error creating pet:', err);z
      setError('Failed to create pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Pet</Text>

      <TextInput
        label="Pet Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Pet Type (e.g., Dog, Cat)"
        value={petType}
        onChangeText={setPetType}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Breed"
        value={breed}
        onChangeText={setBreed}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Gender"
        value={gender}
        onChangeText={setGender}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}>
        Add Pet
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        disabled={loading}
        style={styles.button}>
        Cancel
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2e7d32',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
  },
});
