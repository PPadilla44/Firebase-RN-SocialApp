import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Fire from "../Fire";
import { doc, onSnapshot, collection, arrayUnion, setDoc, getFirestore, query, where, updateDoc, getDocs, addDoc, getDoc } from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { set } from 'firebase/database';

export default MessageScreen = ({ navigation }) => {

    const { otherUser } = navigation.state.params;

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
    const [chatId, setChatId] = useState("");


    const getChat = async (userId) => {
        const docRef = collection(getFirestore(), "chats");
        const q = query(docRef, where('users', 'array-contains-any', [userId, otherUser.id]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id);
                setMessages(doc.data().messages)
                setChatId(doc.id)
            });
        } else {
            console.log("NEW CHAT");
            const newChat = await addDoc(collection(getFirestore(), "chats"), {
                users: [userId, otherUser.id],
                messages: [],
                createdAt: Date.now(),
            });
            setChatId(newChat.id)
        }
    }

    useEffect(async () => {
        const user = Fire.shared.uid;

        const unsub = onSnapshot(doc(Fire.shared.firestore, "users", user), (doc) => {
            setUser(doc.data())
            getChat(doc.data().id);
        });

        return () => unsub()
    }, [])

    useEffect(() => {

    }, [user])

    const onSend = async (messages = []) => {
        const chatRef = doc(getFirestore(), "chats", chatId)


        const messageData = {
            sender: user.id,
            text: messages[0].text,
            chatId,
            createdAt: Date.now()
        };

        // Atomically add a new region to the "regions" array field.
        await updateDoc(chatRef, {
            messages: arrayUnion(messageData)
        });


        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={user}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})