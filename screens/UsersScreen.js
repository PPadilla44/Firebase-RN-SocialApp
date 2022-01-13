import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import { doc, onSnapshot, collection, getDoc, getDocs } from "firebase/firestore";
import { getDatabase, ref, child, push, set, get, onValue } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

import Fire from "../Fire";
import { FlatList } from "react-native-gesture-handler";

export default UsersScreen = (props) => {

    const [userList, setUserList] = useState([])
    const db = Fire.shared.firestore;

    useEffect(() => {
        const docRef = collection(db, "users");
        const unsub = onSnapshot(docRef,
            (snap) => {
                let newUsers = [];
                snap.forEach((doc) => {
                    console.log(doc.data());
                    newUsers.push(doc.data());
                })
                setUserList(newUsers)
            },
            (err) => {
                console.log(err);
            })

        return () => unsub();
    }, []);

    const renderUser = (user) => {
        console.log(user);
        return (
            <View style={styles.userContainer}>
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
        )
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Users</Text>
            </View>
            <FlatList 
                style={styles.feed}
                data={userList}
                renderItem={({item}) => renderUser(item)}
                keyExtractor={user => user.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    userContainer : {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
        paddingHorizontal: 16
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 15,
        shadowOpacity: 0.4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 68
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
    },
})