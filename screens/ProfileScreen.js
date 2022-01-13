import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fire from "../Fire";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";


export default ProfileScreen = (props) => {

    const [user, setUser] = useState({});

    useEffect(() => {
        const user = props.uid || Fire.shared.uid;

        const unsub = onSnapshot(doc(Fire.shared.firestore, "users", user), (doc) => {
            console.log("Current data: ", doc.data());
            setUser(doc.data())
        });

        return () => unsub()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 64, alignItems: "center" }}>
                <View style={styles.avatarContainer}>
                    {
                        user.avatar ?
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            :
                            <Ionicons style={styles.avatar} name="ios-person" size={136} />
                    }
                </View>
                <Text style={styles.name}>{user.name}</Text>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>21</Text>
                    <Text style={styles.statTitle}>Posts</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>981</Text>
                    <Text style={styles.statTitle}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statAmount}>63</Text>
                    <Text style={styles.statTitle}>Following</Text>
                </View>
            </View>
                <Button onPress={() => {Fire.shared.signOut()}} title="Log out" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 15,
        shadowOpacity: 0.4,
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name: {
        marginTop: 24,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center"
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 32
    },
    stat: {
        alignItems: "center",
        flex: 1
    },
    statAmount: {
        color: "#4F566D",
        fontSize: 18,
        fontWeight: "300"
    },
    statTitle: {
        color: "#C3C5CD",
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4
    }
})