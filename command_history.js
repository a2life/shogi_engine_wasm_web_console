// command_history.js

const input = document.getElementById("input");

// --- Persistent history (load from localStorage) ---
const HISTORY_KEY = "yaneuraou_command_history";

let history = [];
try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
    if (Array.isArray(saved)) {
        history = saved.slice(-100); // keep max 100
    }
} catch (e) {
    console.warn("Failed to load history:", e);
}

let historyIndex = -1;

// --- Save history back to localStorage ---
function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

input.addEventListener("keydown", (e) => {

    // Navigate history: UP
    if (e.key === "ArrowUp") {
        if (history.length > 0) {
            if (historyIndex === -1) {
                historyIndex = history.length - 1;
            } else if (historyIndex > 0) {
                historyIndex--;
            }
            input.value = history[historyIndex];
        }
        e.preventDefault();
    }

    // Navigate history: DOWN
    if (e.key === "ArrowDown") {
        if (history.length > 0) {
            if (historyIndex !== -1 && historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = -1;
                input.value = "";
            }
        }
        e.preventDefault();
    }

    // Enter key: store command
    if (e.key === "Enter") {
        const cmd = input.value.trim();
        if (cmd !== "") {
            history.push(cmd);
            if (history.length > 100) {
                history.shift(); // keep max 100
            }
            saveHistory(); // persist to localStorage
        }
        historyIndex = -1;
    }
});
