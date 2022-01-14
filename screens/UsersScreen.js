import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { onSnapshot, collection, getDocs, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


import Fire from "../Fire";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";

export default UsersScreen = ({ navigation }) => {

    const [chatList, setChatList] = useState([])
    const db = Fire.shared.firestore;
    const auth = getAuth();

    useEffect(async () => {
        const docRef = collection(db, "chats");
        const q = query(docRef, where('users', 'array-contains', [auth.currentUser.uid]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {

            const unsub = onSnapshot(q,
                (snap) => {
                    let newChats = [];
                    snap.forEach((doc) => {
                        const oneChat = doc.data();
                        console.log(oneChat.id);
                        if (auth.currentUser.uid !== oneChat.id) {
                            newChats.push(oneChat);
                        }
                    })
                    setChatList(newUsers)
                },
                (err) => {
                    console.log(err);
                })

            return () => unsub();

        } else {
            console.log("No chats");
        }


    }, []);

    const hanldeSelectUser = (user) => {
        navigation.navigate("Message", {
            otherUser: user,
        })
    }

    const renderUser = (user) => {
        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => hanldeSelectUser(user)}>
                <View style={styles.avatarContainer}>
                    {
                        user.avatar ?
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            :
                            <Ionicons style={styles.avatar} name="ios-person" size={136} />
                    }
                </View>
                <Text style={styles.name}>{user.name}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity >
                    <Ionicons name="search" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NewChat")} >
                    <Ionicons name="create" size={24} />
                </TouchableOpacity>
            </View>
            <FlatList
                style={styles.feed}
                data={chatList}
                renderItem={({ item }) => renderUser(item)}
                keyExtractor={item => item.rid}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
    },
    feed: {
        marginHorizontal: 16
    },
    userContainer: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
        paddingHorizontal: 16,
        alignItems: "center"
    },
    avatarContainer: {
        shadowColor: "#151734",
        shadowRadius: 15,
        shadowOpacity: 0.4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 68,
        marginRight: 10
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
    },
})