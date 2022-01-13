import { FireBaseKeys } from "./config";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

class Fire {
    constructor() {
        initializeApp(FireBaseKeys);
    }

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);
        
        return new Promise( async (res, rej) => {
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

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();


            const storage = getStorage();
            const storageRef = ref(storage, path);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
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