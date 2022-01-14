import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";


export default NewChat = ({ navigation }) => {

    const firestore = getFirestore();
    const auth = getAuth();

    const [results, setResults] = useState([]);
    // const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        const docRef = collection(firestore, "users");
        const unsub = onSnapshot(docRef,
            (snap) => {
                let newUsers = [];
                snap.forEach((doc) => {
                    const otherUser = doc.data();
                    if (auth.currentUser.uid !== otherUser._id) {
                        newUsers.push(otherUser);
                    }
                })
                setResults(newUsers)
            },
            (err) => {
                console.log(err);
            })

        return () => unsub();
    }, []);


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

    const hanldeSelectUser = (user) => {

        //  Only select one user
        navigation.navigate("Message", {
            otherUser: user,
        })
    }

    const handleChat = () => {
        console.log("HANDLNIG CHAT");
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Ionicons name="md-arrow-back" size={24} color="#D8D9DB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Message</Text>
                <TouchableOpacity onPress={handleChat}>
                    <Text style={{ fontWeight: "500" }}>Chat</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.feed} >

                <Text style={styles.feedTitle}>To</Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={searchName => setSearchName(searchName)}
                    value={searchName}
                    placeholder="Search"
                />
                <Text style={styles.feedTitle}>Suggested</Text>
                <FlatList
                    data={results}
                    renderItem={({ item }) => renderUser(item)}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
        alignItems: "center"
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
        alignItems: "center",
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
        borderRadius: 68,
        marginRight: 10
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
})