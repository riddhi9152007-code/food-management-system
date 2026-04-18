const hostname = window.location.hostname;
let BASE_URL = "http://localhost:5000";

if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // Automatically uses your machine's current IP address (like 10.68.165.186) when testing on mobile
    BASE_URL = `http://${hostname}:5000`;
}

export default BASE_URL;
