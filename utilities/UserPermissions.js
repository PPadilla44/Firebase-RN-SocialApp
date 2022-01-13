import Constants from "expo-constants";
import { requestCameraPermissionsAsync } from "expo-camera";


class UserPermissions {
    getCameraPermission = async () => {
        if(Constants.platform.ios) {
            const { status } = await requestCameraPermissionsAsync()

            if (status !== "granted") {
                alert("We need permission to access your camera roll");
            }

        }
    }
}

export default new UserPermissions();