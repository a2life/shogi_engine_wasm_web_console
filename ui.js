// ui.js
import { initCommandHistory } from "./command_history.js";
import { applySetOption } from "./usi_options.js";

export function createUI({ onCommand }) {
    const logEl = document.getElementById("log");
    const inputEl = document.getElementById("input");

    function log(msg) {
        logEl.textContent += msg + "\n";
        logEl.scrollTop = logEl.scrollHeight;
    }

    // Initialize command history
    initCommandHistory(inputEl);

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = inputEl.value.trim();
            inputEl.value = "";

            if (cmd.startsWith("setoption")) {
                applySetOption(cmd);
            }

            log("> " + cmd);
            onCommand(cmd);
        }
    });

    return { log };
}
