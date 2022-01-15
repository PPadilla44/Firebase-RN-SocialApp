import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Fire from "../Fire";
import { doc, onSnapshot, collection, arrayUnion, setDoc, getFirestore, query, where, updateDoc, getDocs, addDoc, orderBy } from "firebase/firestore";
import { Text, StyleSheet, View } from "react-native";

export default MessageScreen = ({ navigation }) => {

    const { otherUser } = navigation.state.params;

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(true);

    const firestore = getFirestore();

    const fetchMessages = async (currentChatId) => {

        if(messages.length > 0) {
            return [...messages];
        }

        const messagesRef = collection(firestore, "messages");
        const messageQ = query(messagesRef, where('chatId', '==', currentChatId), orderBy("createdAt", "desc"));
        const messangeSnapshot = await getDocs(messageQ);

        if (messangeSnapshot.docs.length > 0) {
            let newMessages = [];
            messangeSnapshot.forEach((doc) => {
                newMessages.push(doc.data())
            });
            setMessages(newMessages)
            setLoading(false);
            return(newMessages)

        } else {
            console.log("no messages");
            return([])
        }
    }


    const getChat = async (userId = Fire.shared.uid) => {
        if (chatId) {
            return chatId;
        }
        const docRef = collection(firestore, "chats");
        const q = query(docRef, where('users', 'array-contains-any', [userId, otherUser._id]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {

            let currentChatId;
            querySnapshot.forEach((doc) => {
                currentChatId = doc.id;
            });

            setChatId(currentChatId)
            return currentChatId;
        } else {
            const newChat = await addDoc(collection(firestore, "chats"), {
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

        const unsub = onSnapshot(doc(firestore, "users", user), (doc) => {
            setUser(doc.data());
            getChat(doc.data()._id);
        });

        return () => unsub();
    }, [])

    const updateMessages = async () => {

        let currentChatId = await getChat();
        
        const docRef = doc(firestore, "chats", currentChatId);
        const unsub = onSnapshot(docRef,
            async (snap) => {
                // NEW MESSAGE
                await fetchMessages(currentChatId);
            },
            (err) => {
                console.log(err);
            })


        return () => unsub();

    }

    useEffect(async () => {
        updateMessages();
    }, []);

    const onSend = async (messages = []) => {
        const chatRef = doc(firestore, "chats", chatId)

        const newMessage = await addDoc(collection(firestore, "messages"), {
            user,
            text: messages[0].text,
            chatId,
            createdAt: Date.now()
        });

        const messageRef = doc(firestore, "messages", newMessage.id)
        await setDoc(messageRef, { _id: messageRef.id }, { merge: true })

        const messageData = {
            _id: messageRef.id,
        };

        await updateDoc(chatRef, {
            messages: arrayUnion(messageData)
        });

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }

    return (
        loading ?
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
        :
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