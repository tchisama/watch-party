// Nexus Architectural Analysis: Watch Party Sync
// Pattern: State Synchronization via Centralized Realtime Database (Firebase RTDB).
// Logic: Event-driven feedback loop with mutation locking to prevent "echo" cycles.

let isRemoteChange = false;
let roomRef = null;

// Standardized video selector
const getVideo = () => document.querySelector('video');

/**
 * Update logic for the local video element based on remote state.
 * Uses a temporary lock (isRemoteChange) to prevent the local playback
 * event listeners from triggering a recursive update back to Firebase.
 */
const syncLocalVideo = (data) => {
    const video = getVideo();
    if (!video) return;

    isRemoteChange = true;
    
    // Play/Pause Sync
    if (data.playing && video.paused) {
        video.play().catch(e => console.error("Nexus: Play blocked by browser auto-play policy."));
    } else if (!data.playing && !video.paused) {
        video.pause();
    }

    // Seek Sync (Threshold: 2 seconds to account for network latency)
    if (Math.abs(video.currentTime - data.time) > 2) {
        video.currentTime = data.time;
    }

    // Release lock after browser processing
    setTimeout(() => { isRemoteChange = false; }, 100);
};

/**
 * Injected listener for the content script to receive room data from the background/popup.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SYNC_UPDATE") {
        syncLocalVideo(message.data);
    }
});

/**
 * Local Event Listeners
 * Captures user interactions with the native video player.
 */
const initLocalListeners = () => {
    const video = getVideo();
    if (!video) return;

    ['play', 'pause', 'seeking'].forEach(eventType => {
        video.addEventListener(eventType, () => {
            if (isRemoteChange) return;
            
            // Send event to extension popup/background to update Firebase
            chrome.runtime.sendMessage({
                type: "LOCAL_EVENT",
                data: {
                    playing: !video.paused,
                    time: video.currentTime,
                    timestamp: Date.now()
                }
            });
        });
    });
};

// Initial scan for video
const observer = new MutationObserver(() => {
    if (getVideo()) {
        initLocalListeners();
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
