import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { onSnapshot, collection, getDocs, query, where, getFirestore, getDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";

export default UsersScreen = ({ navigation }) => {

    const [chatList, setChatList] = useState([])
    const firestore = getFirestore();
    const auth = getAuth();

    useEffect(async () => {
        const docRef = collection(firestore, "chats");
        const q = query(docRef, where('users', 'array-contains-any', [auth.currentUser.uid]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {

            const unsub = onSnapshot(q,
                (snap) => {
                    let newChats = [];
                    snap.forEach(async (chatDoc) => {
                        const oneChat = chatDoc.data();
                        newChats.push(oneChat);
                    })
                    handleChats(newChats)
                },
                (err) => {
                    console.log(err);
                })

            return () => unsub();

        } else {
            console.log("No chats");
        }


    }, []);

    const handleChats = async (newChats) => {
        const newUsers = [];
        for (const oneChat of newChats) {
            for (const userId of oneChat.users) {
                if (auth.currentUser.uid !== userId) {
                    const userRef = doc(firestore, "users", userId);
                    const userSnap = await getDoc(userRef);
                    newUsers.push(userSnap.data())
                }
            }
            oneChat.users = newUsers;
        }
        setChatList(newChats)
    }

    const hanldeSelectUser = (user) => {
        navigation.navigate("Message", {
            otherUser: user,
        })
    }

    const renderUser = (chat) => {
        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => hanldeSelectUser(chat)}>
                <View style={styles.avatarContainer}>
                    {
                        chat.users[0].avatar ?
                            <Image style={styles.avatar} source={{ uri: chat.users[0].avatar }} />
                            :
                            <Ionicons style={styles.avatar} name="ios-person" size={40} />
                    }
                </View>
                <Text style={styles.name}>{chat.users[0].name}</Text>
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
                keyExtractor={item => item.id}
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