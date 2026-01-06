// command_history.js

export function initCommandHistory(inputElement) {
    // --- In-memory history (no localStorage) ---
    let history = [];
    let historyIndex = -1;

    inputElement.addEventListener("keydown", (e) => {

        // Navigate history: UP
        if (e.key === "ArrowUp") {
            if (history.length > 0) {
                if (historyIndex === -1) {
                    historyIndex = history.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                inputElement.value = history[historyIndex];
            }
            e.preventDefault();
        }

        // Navigate history: DOWN
        if (e.key === "ArrowDown") {
            if (history.length > 0) {
                if (historyIndex !== -1 && historyIndex < history.length - 1) {
                    historyIndex++;
                    inputElement.value = history[historyIndex];
                } else {
                    historyIndex = -1;
                    inputElement.value = "";
                }
            }
            e.preventDefault();
        }

        // Enter key: store command
        if (e.key === "Enter") {
            const cmd = inputElement.value.trim();
            if (cmd !== "") {
                history.push(cmd);
                if (history.length > 100) {
                    history.shift(); // keep max 100
                }
            }
            historyIndex = -1;
        }
    });
}
