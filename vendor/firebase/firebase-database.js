export const getDatabase = (app) => window.firebase.database.getDatabase(app);
export const ref = (db, path) => window.firebase.database.ref(db, path);
export const onValue = (ref, cb) => window.firebase.database.onValue(ref, cb);
export const set = (ref, data) => window.firebase.database.set(ref, data);
