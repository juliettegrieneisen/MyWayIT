import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjA4mIMeW69bXAPMU8OxYe9lechQla5sY",
  authDomain: "myway-it.firebaseapp.com",
  projectId: "myway-it",
  storageBucket: "myway-it.firebasestorage.app",
  messagingSenderId: "356990534691",
  appId: "1:356990534691:web:2be4c1b24cf5c7159a5d96"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function toggleMenu() {
    const menu = document.getElementById("monMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}




let topics = [];

const topicsDiv = document.getElementById("topics");
const topicInput = document.getElementById(topicsInput);
const storageKey = "topics";

function renderTopics() {
    topicsDiv.innerHTML = "";
    topicsDiv.ondragover = (e) => {
        e.preventDefault();
    }

        topics.forEach((topic, idx) => {
        const container = document.createElement("div");
        container.style.marginBottom = "10px";
        container.draggable = true;
        container.dataset.index = idx;

        container.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", idx);
            container.style.opacity = "0.4";
        };
        container.ondragend = () => {
            container.style.opacity = "1";
        };
        container.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        container.addEventListener("drop", (e) => {
            e.preventDefault();
            const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
            const toIdx = idx;
            if (fromIdx === toIdx) return;
            const moved = topics.splice(fromIdx, 1)[0];
            topics.splice(toIdx, 0, moved);
            saveTopics();
            renderTopics();
        });

        const checkButton = document.createElement("button");
        checkButton.textContent = "✔";
        checkButton.style.color = topic.checked ? "pink" : "white";
        checkButton.style.marginRight = "10px";
        checkButton.onclick = () => {
            topics[idx].checked = !topics[idx].checked;
            saveTopics();
            renderTopics();
        };

        const text = document.createElement("p");
        text.style.display ="inline";
        text.style.marginRight = "10px";
        text.textContent = topic.name;

        const button = document.createElement("button");
        button.textContent = "✘";
        button.onclick = () => removeTopic(idx);

        container.appendChild(checkButton);
        container.appendChild(text);
        container.appendChild(button);

        topicsDiv.appendChild(container);
    });
}


function loadTopics() {
  onSnapshot(collection(db, "topics"), (snapshot) => {
    topics = [];
    snapshot.forEach((docSnap) => {
      topics.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderTopics();
  });
}

function saveTopics() {
}

function addTopic() {
    const input = document.getElementById("topicsInput");
    const value = input.value;

    if (!value) {
        alert("You cannot add an empty topic")
        return 
    }
    topics.push({ name: value, checked: false});
    renderTopics();
    input.value = "";
    saveTopics();
}

function removeTopic(idx) {
    topics.splice(idx, 1);
    renderTopics();
    saveTopics();
}

document.addEventListener("DOMContentLoaded", loadTopics);



