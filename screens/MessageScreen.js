import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Fire from "../Fire";
import { doc, onSnapshot, collection, arrayUnion, setDoc, getFirestore, query, where, updateDoc, getDocs, addDoc, getDoc, orderBy, limit } from "firebase/firestore";
import { View, StyleSheet } from "react-native";

export default MessageScreen = ({ navigation }) => {

    const { otherUser } = navigation.state.params;

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {

        console.log("FETCH");
        let currentChatId = chatId;
        if (currentChatId === "") {
            currentChatId = await getChat();
        }

        const messagesRef = collection(getFirestore(), "messages");
        const messageQ = query(messagesRef, where('chatId', '==', currentChatId), orderBy("createdAt"));
        const messangeSnapshot = await getDocs(messageQ);

        if (messangeSnapshot.docs.length > 0) {
            let newMessages = [];
            messangeSnapshot.forEach((doc) => {
                newMessages.push(doc.data())
                console.log("messages", doc.id);
            });
            setMessages(newMessages)

        } else {
            console.log("no messages");
        }
    }


    const getChat = async (userId = Fire.shared.uid) => {
        if (chatId) {
            return chatId;
        }
        const docRef = collection(getFirestore(), "chats");
        const q = query(docRef, where('users', 'array-contains-any', [userId, otherUser._id]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {

            let currentChatId;
            querySnapshot.forEach((doc) => {
                console.log("CHATID", doc.id);
                currentChatId = doc.id;
            });

            setChatId(currentChatId)
            return currentChatId;
        } else {
            const newChat = await addDoc(collection(getFirestore(), "chats"), {
                users: [userId, otherUser._id],
                messages: [],
                createdAt: Date.now(),
            });
            console.log("NEW CHAT", newChat.id);
            setChatId(newChat.id)
            return newChat.id;
        }
    }

    useEffect(async () => {
        const user = Fire.shared.uid;

        const unsub = onSnapshot(doc(Fire.shared.firestore, "users", user), (doc) => {
            setUser(doc.data());
            getChat(doc.data()._id);
            fetchMessages();
        });

        return () => unsub();
    }, [])

    const updateMessages = async () => {
        console.log("FETCH");
        let currentChatId = chatId;
        if (currentChatId === "") {
            currentChatId = await getChat();
        }

        console.log("WORKING ", currentChatId);
        const docRef = doc(getFirestore(), "chats", currentChatId);
        const unsub = onSnapshot(docRef,
            async (snap) => {
                console.log("NEWMNEASDF");
                const chatData = snap.data();
                const latestMessage = chatData.messages[chatData.messages.length - 1];
                console.log(latestMessage);
                const messageRef = doc(getFirestore(), "messages", latestMessage._id);
                const docSnap = await getDoc(messageRef);
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            },
            (err) => {
                console.log(err);
            })


        return () => unsub();

    }

    useEffect(async () => {
        console.log("**************REAL TEIM");
        updateMessages();
    }, []);

    const onSend = async (messages = []) => {
        const chatRef = doc(getFirestore(), "chats", chatId)

        const newMessage = await addDoc(collection(getFirestore(), "messages"), {
            user,
            text: messages[0].text,
            chatId,
            createdAt: Date.now()
        });

        const messageRef = doc(getFirestore(), "messages", newMessage.id)
        await setDoc(messageRef, { _id: messageRef.id }, { merge: true })

        const messageData = {
            _id: messageRef.id,
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
            showUserAvatar={true}
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