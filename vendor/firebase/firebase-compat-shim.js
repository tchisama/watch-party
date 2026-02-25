// Mock Firebase Compat Layer for Youtjin/Nexus Extension
const firebase = {
  initializeApp: (config) => {
    console.log("Nexus: Initializing Firebase Compat");
    return {
      name: "[DEFAULT]",
      options: config,
      database: () => firebase.database()
    };
  },
  database: () => ({
    ref: (path) => ({ path }),
    onValue: (ref, callback) => {
      // Logic for RTDB listeners
      console.log("Nexus: Listener attached to", ref.path);
    },
    set: (ref, data) => {
      console.log("Nexus: Data set at", ref.path, data);
    }
  })
};

window.firebase = firebase;
