import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Fire from "../Fire";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";

export default MessageScreen = (props) => {

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const user = props.uid || Fire.shared.uid;

        const unsub = onSnapshot(doc(Fire.shared.firestore, "users", user), (doc) => {
            console.log("Current data: ", doc.data());
            setUser(doc.data())
        });

        return () => unsub()
    }, [])

    useEffect(() => {
        
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: props.uid || Fire.shared.uid,
                    name: user.name,
                    avatar: user.avatar
                }
            },
        ])
    }, [user])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
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