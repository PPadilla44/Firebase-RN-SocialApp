import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const post = [
    {
        id: "1",
        name: "Joe McKay",
        text: "Lorem asdousbduoas doasghoiashoiash osihoisshoiashdhsaoh oshdasd oudsgd d sasds",
        timestamp: 1569109273726,
        avatar: require("../assets/me-boxed.jpg"),
        image: require("../assets/me-boxed.jpg")
    },
    {
        id: "2",
        name: "Pablo P",
        text: "dasdsadsa fffff dgogasghoiagggggshoiash osihoisshoiashdhsaoh oshdasd oudsgd d sasds",
        timestamp: 1569109273726,
        avatar: require("../assets/me-boxed.jpg"),
        image: require("../assets/me-boxed.jpg")
    },
]


export default HomeScreen = (props) => {


    const renderPost = (post) => {
        return (
            <View style={styles.feedItem}>
                <Image source={post.avatar} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.name}>{post.name}</Text>
                            <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                        </View>

                        <Ionicons name="ellipsis-horizontal" size={24} color={"#73788B"} />

                    </View>

                    <Text style={styles.post}>{post.text}</Text>

                    <Image source={post.image} style={styles.postImage} resizeMode="cover" />

                    <View style={{ flexDirection: "row" }}>
                        <Ionicons name="heart-outline" size={24} color="#73788B" style={{ marginRight: 16 }} />
                        <Ionicons name="chatbox-ellipses-sharp" size={24} color="#73788B" />
                    </View>
                </View>
            </View>
        )
    };

    return (
        <View style={styles.contatiner} >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Feed</Text>
            </View>

            <FlatList
                style={styles.feed}
                data={post}
                renderItem={({ item }) => renderPost(item)}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            >
            </FlatList>

        </View>
    )
}

const styles = StyleSheet.create({
    contatiner: {
        flex: 1,
        backgroundColor: "#EFECF4"
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
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    }
})