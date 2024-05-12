const fs = require('fs').promises;

const readUsersFromFile = async(userData) => {
    let jsonData = {};
    const data = await fs.readFile(userData, { encoding: 'utf8' });
    if (data) {
        // Parse the JSON data
        jsonData = JSON.parse(data);
    }
    return jsonData;
}

// Write user data to users.json file
const writeUsersToFile = async (userData, users) => {
    await fs.writeFile(userData, JSON.stringify(users, null, 2));
}

module.exports = {readUsersFromFile, writeUsersToFile}
