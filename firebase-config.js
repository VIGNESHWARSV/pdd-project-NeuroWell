// Firebase Firestore Database Module
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Save or Update User Profile Information
 * @param {string} uid 
 * @param {object} userData { fullName, age, gender, email }
 */
export const saveUserProfile = async (uid, userData) => {
    try {
        await setDoc(doc(db, "users", uid), {
            ...userData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Save Profile Error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch User Profile Information
 * @param {string} uid 
 */
export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { data: docSnap.data(), error: null };
        } else {
            return { data: null, error: "No profile found" };
        }
    } catch (error) {
        return { data: null, error: error.message };
    }
};

/**
 * Save Mental Health Questionnaire Results
 * @param {string} uid 
 * @param {object} answers { stressLevel, sleepQuality, moodScore, anxietyLevel }
 */
export const saveQuestionnaire = async (uid, answers) => {
    try {
        await setDoc(doc(db, "questionnaire", uid), {
            uid,
            ...answers,
            timestamp: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Save Goal Selections
 * @param {string} uid 
 * @param {Array} goals ['Reduce Stress', 'Improve Sleep', etc.]
 */
export const saveGoals = async (uid, goals) => {
    try {
        await setDoc(doc(db, "goals", uid), {
            uid,
            goals,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Add Mood Tracking Entry
 * @param {string} uid 
 * @param {object} moodData { mood, notes }
 */
export const addMoodEntry = async (uid, moodData) => {
    try {
        const moodRef = collection(db, "moodTracking");
        await addDoc(moodRef, {
            uid,
            ...moodData,
            timestamp: serverTimestamp(),
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Fetch Mood History
 * @param {string} uid 
 */
export const getMoodHistory = async (uid) => {
    try {
        const q = query(collection(db, "moodTracking"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        const history = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() });
        });
        return { data: history, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

/**
 * Save Notification Preferences
 * @param {string} uid 
 * @param {object} prefs { dailyReminder, weeklyReport, meditationReminder }
 */
export const saveNotificationPrefs = async (uid, prefs) => {
    try {
        await setDoc(doc(db, "notifications", uid), {
            uid,
            ...prefs,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Save Analysis Result (Face/Voice)
 * @param {string} uid 
 * @param {object} analysisData { type, score, details }
 */
export const saveAnalysisResult = async (uid, analysisData) => {
    try {
        const analysisRef = collection(db, "analysisResults");
        await addDoc(analysisRef, {
            uid,
            ...analysisData,
            timestamp: serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        });
        return { success: true };
    } catch (error) {
        console.error("Save Analysis Error:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch Weekly Analysis Data
 * @param {string} uid 
 */
export const getWeeklyAnalysis = async (uid) => {
    try {
        const q = query(
            collection(db, "analysisResults"), 
            where("uid", "==", uid)
        );
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data());
        });
        return { data: results, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

