import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default LoadingScreen = (props) => {

    const { navigation } = props;

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            navigation.navigate(user ? "App" : "Auth")
        })
    },[])

    return (
        <View style={styles.contatiner} >
            <Text>Loading...</Text>
            <ActivityIndicator size={"large"}></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    contatiner:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})