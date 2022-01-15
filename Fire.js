import { FireBaseKeys } from "./config";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, addDoc, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

class Fire {
    constructor() {
        initializeApp(FireBaseKeys);
    }

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);

        return new Promise(async (res, rej) => {
            try {
                const ref = await addDoc(collection(this.firestore, "posts"), {
                    text,
                    uri: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                });
                return res(ref)
            } catch (err) {
                return rej(err)
            }


        })
    }

    uploadPhotoAsync = async (uri, filename) => {

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();


            const storage = getStorage();
            const storageRef = ref(storage, filename);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                    }
                },
                (error) => {
                    rej(error);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref)
                        console.log("Available at", url);
                        res(url)
                    } catch (err) {
                        rej(err)
                    }

                }
            )
        })
    }

    createUser = async user => {
        let remoteUri = null;

        try {
            const { email, avatar, password, name } = user;

            const auth = getAuth();
            const createdUser = await createUserWithEmailAndPassword(auth, email, password);
            const ref = doc(this.firestore, "users", this.uid);

            await setDoc(ref, {
                _id: createdUser.user.uid,
                name,
                email,
                avatar: null,
            });

            if (avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`)

                setDoc(ref, { avatar: remoteUri }, { merge: true })
            }

        } catch (err) {
            alert("Error: ", err)
        }

    }

    signOut = () => {
        signOut(getAuth());
    }

    get firestore() {
        return getFirestore();
    }


    get uid() {
        return (getAuth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }

}

Fire.shared = new Fire();
export default Fire;