import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";
import UserPermissions from "../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker";


export default RegisterScreen = (props) => {

    const { navigation } = props;


    const [avatar, setAvatar] = useState(null)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSignUp = async () => {

        let userData = { name, email, password, avatar }

        Fire.shared.createUser(userData);

    }

    const handlePickAvatar = async () => {
        UserPermissions.getCameraPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
            setAvatar(result.uri);
        }
    }

    return (

        <KeyboardAwareScrollView style={styles.contatiner} >

            <StatusBar barStyle="light-content"></StatusBar>

            <Image
                source={require("../assets/authHeader.png")}
                style={styles.header}
            />
            <Image
                source={require("../assets/authHeader.png")}
                style={styles.footer}
            />

            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={32} color={"#FFF"}></Ionicons>
            </TouchableOpacity>

            <View style={{ position: "absolute", top: 64, alignItems: "center", width: "100%" }}>
                <Text style={styles.greeting}>{`Hello!\nSign up to get started`}</Text>
                <TouchableOpacity style={styles.avatarPlaceholder} onPress={handlePickAvatar} >
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Ionicons name="add" size={40} color={"#FFF"} style={{ marginTop: 6, marginLeft: 2 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.errorMessage}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.inputTitle}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={name => setName(name)}
                        value={name}
                    />
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={email => setEmail(email)}
                        value={email}
                    />
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={password => setPassword(password)}
                        value={password}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp} >
                <Text style={{ color: "#FFF", fontWeight: "500" }} >Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ alignSelf: "center", marginTop: 32 }}
                onPress={() => navigation.navigate("Login")}
            >
                <Text style={{ color: "#414959", fontSize: 13 }}>
                    Not new to SocialApp? <Text style={{ fontWeight: "500", color: "#E9446A" }}>Login</Text>
                </Text>
            </TouchableOpacity>

        </KeyboardAwareScrollView>

    )
}

const styles = StyleSheet.create({
    contatiner: {
        flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
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
        bottom: -350,
        left: -100,
        opacity: .5,
        transform: [{ rotate: "180deg" }]
    },
    back: {
        position: "absolute",
        top: 48,
        left: 32,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: "#E1E2E6",
        borderRadius: 50,
        marginTop: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})