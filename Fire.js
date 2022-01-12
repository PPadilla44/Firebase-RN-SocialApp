import { FireBaseKeys } from "./config";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";


class Fire {
    constructor() {
        initializeApp(FireBaseKeys);
    }

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, req) => {
            collection("posts").add({
                text,
                uri: this.uid,
                timestamp: this.timestamp,
                image: remoteUri
            })
            .then(ref => {
                res(ref)
            })
            .catch(error => {
                req(error)
            })
        })
    }

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, req) => {
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
                    req(error);
                    // Handle unsuccessful uploads
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadUrl) => {
                            console.log("available at", downloadUrl);
                            res(downloadUrl)
                        }) .catch(err => {
                            console.log("BEO", err)
                        })
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