class Validator {
    static validateUserDetails(userInfo) {
        const { userName, password, emailId } = userInfo;
        if (!userName || !password || !emailId) {
            return {
                "status": false,
                "message": "Username,emailid and password  are required"
            };
        } else {
            return {
                "status": true,
                "message": "Validated successfully"
            };
        }
    }

    static validateLoginDetails(userInfo) {
        const { userName, password } = userInfo;
        if (!userName || !password) {
            return {
                "status": false,
                "message": "Username,Password required"
            };
        } else {
            return {
                "status": true,
                "message": "Validated successfully"
            };
        }
    }

    static validatePreferencesInput(body) {
        const { preferences } = body;
        if (!preferences || !Array.isArray(preferences)) {
            return { error: "Preferences is empty" };
        }
        return null;
    }
}

module.exports = Validator;