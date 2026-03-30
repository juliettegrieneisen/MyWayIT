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

// ── Menu ──────────────────────────────────────────────────────────────────────

function toggleMenu() {
    const menu = document.getElementById("monMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// ── Checklist ─────────────────────────────────────────────────────────────────

let topics = [];
const topicsDiv = document.getElementById("topics");

function renderTopics() {
    topicsDiv.innerHTML = "";
    topicsDiv.ondragover = (e) => e.preventDefault();

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
        container.addEventListener("dragover", (e) => e.preventDefault());
        container.addEventListener("drop", (e) => {
            e.preventDefault();
            const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
            const toIdx = idx;
            if (fromIdx === toIdx) return;
            const moved = topics.splice(fromIdx, 1)[0];
            topics.splice(toIdx, 0, moved);
            saveOrder();
            renderTopics();
        });

        const checkButton = document.createElement("button");
        checkButton.textContent = "✔";
        checkButton.style.color = topic.checked ? "pink" : "white";
        checkButton.style.marginRight = "10px";
        checkButton.onclick = () => {
            updateDoc(doc(db, "topics", topic.id), { checked: !topic.checked });
        };

        const text = document.createElement("p");
        text.style.display = "inline";
        text.style.marginRight = "10px";
        text.textContent = topic.name;

        const button = document.createElement("button");
        button.textContent = "✘";
        button.onclick = () => removeTopic(topic.id);

        container.appendChild(checkButton);
        container.appendChild(text);
        container.appendChild(button);
        topicsDiv.appendChild(container);
    });
}

// Save the current array order to Firestore by updating each doc's `order` field
async function saveOrder() {
    const updates = topics.map((topic, idx) =>
        updateDoc(doc(db, "topics", topic.id), { order: idx })
    );
    await Promise.all(updates);
}

function loadTopics() {
    onSnapshot(collection(db, "topics"), (snapshot) => {
        topics = [];
        snapshot.forEach((docSnap) => {
            topics.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort by `order` field so position is preserved across devices & refreshes
        topics.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        renderTopics();
    });
}

async function addTopic() {
    const input = document.getElementById("topicsInput");
    const value = input.value.trim();
    if (!value) {
        alert("You cannot add an empty topic");
        return;
    }
    // New topic goes to the end
    await addDoc(collection(db, "topics"), { name: value, checked: false, order: topics.length });
    input.value = "";
}

async function removeTopic(id) {
    await deleteDoc(doc(db, "topics", id));
}

document.getElementById("menuBtn").addEventListener("click", toggleMenu);
document.getElementById("addTopicBtn").addEventListener("click", addTopic);

loadTopics();
