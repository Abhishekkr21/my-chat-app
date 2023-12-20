// Import the functions you need from the SDKs you need
// import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { EmojiButton } from "https://cdn.skypack.dev/@joeattardi/emoji-button";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARsYfawzncNrxBEfmKbAF1GKbbVJNR-cA",
    authDomain: "AIzaSyARsYfawzncNrxBEfmKbAF1GKbbVJNR-cA",
    projectId: "chat-app-16f84",
    storageBucket: "chat-app-16f84.appspot.com",
    messagingSenderId: "693433602268",
    appId: "691:693433602268:web:bfb211a548cf4c6583a419",
    measurementId: "G-Z3Z3TB8K8P"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Elements
const signInButton = document.getElementById("signInButton");
const userInfo = document.getElementById("user-info");
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const emojiPickerContainer = document.getElementById("emoji-picker-container");

let user;

// Emoji Picker
const emojiPicker = new EmojiButton();
emojiPicker.on("emoji", (selection) => {
  messageInput.value += selection.emoji;
});

// Listen for authentication state changes
onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
    user = currentUser;
    signInButton.style.display = "none";
    userInfo.innerHTML = `<p>Welcome, ${user.displayName}!</p>`;
    loadMessages();
  } else {
    signInButton.style.display = "block";
    userInfo.innerHTML = "";
    messagesContainer.innerHTML = "";
  }
});

// Sign In with Google
signInButton.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
});

// Send Message
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    sendMessage(message);
    messageInput.value = "";
  }
});

// Listen for Enter key press
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

// Show Emoji Picker
emojiPickerContainer.addEventListener("click", () => {
  emojiPicker.togglePicker(emojiPickerContainer);
});

// Send Emoji
emojiPicker.on("emoji", (selection) => {
  messageInput.value += selection.emoji;
});

// Send Message to Firestore
const sendMessage = async (message) => {
  try {
    const timestamp = new Date();
    await addDoc(collection(db, "messages"), {
      userId: user.uid,
      displayName: user.displayName,
      message,
      timestamp,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
};

// Load Messages from Firestore
const loadMessages = () => {
  const messagesRef = collection(db, "messages");
  onSnapshot(messagesRef, (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const msgElement = document.createElement("div");
      msgElement.innerHTML = `<p>${data.displayName}: ${data.message} - ${data.timestamp.toDate().toLocaleTimeString()}</p>`;
      messagesContainer.appendChild(msgElement);
    });
  });
};