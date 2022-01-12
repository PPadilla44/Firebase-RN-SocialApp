import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default LoginScreen = (props) => {


    const { navigation } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async () => {
        
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            setErrorMessage(err.message)
        }

    }

    LayoutAnimation.easeInEaseOut();

    return (
        <View style={styles.contatiner} >
            <StatusBar barStyle="light-content"></StatusBar>
            <Image
                source={require("../assets/authHeader.png")} 
                style={styles.header}
                >
                </Image>
            <Image
                source={require("../assets/authHeader.png")} 
                style={ styles.footer }
                >
                </Image>
            <Text style={styles.greeting}>{`Hello again.\nWelcome back.`}</Text>

            <View style={styles.errorMessage}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.inputTitle}>Email Address</Text>
                    <TextInput 
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={email => setEmail(email)}
                        value={email}
                        >
                        </TextInput>
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={password => setPassword(password)}
                        value={password}
                        >
                        </TextInput>
                </View>
            </View>
        
            <TouchableOpacity style={styles.button} onPress={handleLogin} >
                <Text style={{ color: "#FFF", fontWeight: "500" }} >Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{ alignSelf: "center", marginTop: 32 }} 
                onPress={() => navigation.navigate("Register")}
                >
                <Text style={{ color: "#414959", fontSize: 13 }}>
                    New to SocialApp? <Text style={{ fontWeight: "500", color: "#E9446A" }}>Sign Up</Text>
                </Text>
            </TouchableOpacity>

        </View>
    )
}

LoginScreen.navigationOptions = props => ({
    headerShown: false
})

const styles = StyleSheet.create({
    contatiner: {
        flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        width: 600, 
        marginTop: -50, 
        marginLeft: -150
    },
    footer: {
        width: 600,
        position: "absolute", 
        bottom: -100, 
        left: -100, 
        opacity: .5,
        transform: [{ rotate: "135deg" }]
    }
})