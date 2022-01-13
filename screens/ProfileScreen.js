import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { View, Text, StyleSheet } from  "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default ProfileScreen = (props) => {

    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            <TouchableOpacity onPress={() => { signOut(getAuth()) } }>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})