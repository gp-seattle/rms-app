import { Auth, Hub } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Auth } from 'aws-amplify';

function AuthScreen() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                    getUser().then((userData) => setUser(userData));
                    break;
                case 'signOut':
                    setUser(null);
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });

        getUser().then((userData) => setUser(userData));
    }, []);

    function getUser() {
        return Auth.currentAuthenticatedUser()
            .then((userData) => userData)
            .catch(() => console.log('Not signed in'));
    }

    return (
        <View>
            <Text>User: {user ? JSON.stringify(user.attributes) : 'None'}</Text>
            {user ? (
                <Button title="Sign Out" onPress={() => Auth.signOut()} />
            ) : (
                <Button title="Federated Sign In" onPress={() => Auth.federatedSignIn({provider: "Google"})} />
            )}
        </View>
    );
}

export default AuthScreen;