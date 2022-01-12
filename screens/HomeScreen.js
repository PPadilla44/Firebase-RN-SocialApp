import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import { getAuth, signOut } from "firebase/auth";

export default HomeScreen = (props) => {

    const [email, setEmail] = useState("")
    const [displayName, setDisplayName] = useState("")

    useEffect(() => {
        const {email, displayName} = getAuth().currentUser;

        setEmail(email);
        setDisplayName(displayName)
    },[])

    const signOutUser = async () => {
        const auth = getAuth();
        await signOut(auth);
    }

    LayoutAnimation.easeInEaseOut();

    return (
        <View style={styles.contatiner} >
            <Text>Hi {email}</Text>

            <TouchableOpacity style={{ marginTop: 32 }} onPress={(signOutUser)}>
                <Text>Logout</Text>
            </TouchableOpacity>
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