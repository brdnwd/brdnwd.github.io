import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqxr19pzRexBYbp1BllKtchdbOqPxPvnU",
  authDomain: "brdnwd-website.firebaseapp.com",
  projectId: "brdnwd-website",
  storageBucket: "brdnwd-website.firebasestorage.app",
  messagingSenderId: "362266737338",
  appId: "1:362266737338:web:67ecf1650d3d5870db6083",
  measurementId: "G-DLHRDGNBKD",
  databaseURL: "https://brdnwd-website-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

const viewsElement = document.getElementById("site-views");

if (viewsElement) {
  const visitorKey = "brdnwd_website_visited";
  const viewsRef = ref(database, "site/visitors");

  async function updateVisitorCount() {
    try {
      await signInAnonymously(auth);

      const hasVisited = localStorage.getItem(visitorKey);

      if (!hasVisited) {
        await runTransaction(viewsRef, (currentValue) => {
          return (currentValue || 0) + 1;
        });

        localStorage.setItem(visitorKey, "true");
      }

      const snapshot = await get(viewsRef);

      if (snapshot.exists()) {
        const count = Number(snapshot.val());

        viewsElement.textContent = count.toLocaleString("en-US");
      }
    } catch (error) {
      console.error("Visitor counter error:", error);
    }
  }

  updateVisitorCount();
}

const clockElement = document.getElementById("site-time");

if (clockElement) {
  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    clockElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}
