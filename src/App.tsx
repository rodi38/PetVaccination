import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {AuthProvider} from './contexts/AuthContext';
import {Routes} from './routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const theme = {
    colors: {
        primary: '#2e7d32',
        accent: '#81c784',
    },
};

const App = () => {
    return (
        <PaperProvider
            theme={theme}
            settings={{
                icon: props => <MaterialCommunityIcons {...props} />,
            }}>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </PaperProvider>
    );
};

export default App;
