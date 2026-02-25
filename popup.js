import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB4ngRSyh70p42UR4w3vfC0gyu9WBfWaOs",
    authDomain: "watch-party-3acbf.firebaseapp.com",
    projectId: "watch-party-3acbf",
    storageBucket: "watch-party-3acbf.firebasestorage.app",
    messagingSenderId: "728104560689",
    appId: "1:728104560689:web:09d3af6b129d0d95e2cd10",
    measurementId: "G-PV0KZJP9MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRoomId = null;
let isRemoteUpdate = false;

const statusEl = document.getElementById('status');
const roomIdInput = document.getElementById('roomId');
const joinBtn = document.getElementById('joinRoom');

joinBtn.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (!roomId) return;
    joinRoom(roomId);
});

function joinRoom(roomId) {
    currentRoomId = roomId;
    const roomRef = ref(db, 'rooms/' + roomId);

    statusEl.innerText = "Connected: " + roomId;
    statusEl.style.color = "#3b82f6";

    // Listen for remote changes
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            isRemoteUpdate = true;
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "SYNC_UPDATE",
                        data: data
                    });
                }
            });
            setTimeout(() => { isRemoteUpdate = false; }, 500);
        }
    });
}

// Listen for local events from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "LOCAL_EVENT" && currentRoomId && !isRemoteUpdate) {
        set(ref(db, 'rooms/' + currentRoomId), message.data);
    }
});
