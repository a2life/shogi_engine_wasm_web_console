// ui.js
import {initCommandHistory} from "./command_history.js";
export function createUI({ onCommand }) {
    const logEl = document.getElementById("log");
    const inputEl = document.getElementById("input");

    function log(msg) {
        logEl.textContent += msg + "\n";
        logEl.scrollTop = logEl.scrollHeight;
    }

    initCommandHistory(inputEl);

    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = inputEl.value.trim();
            inputEl.value = "";

            if (cmd.startsWith("setoption")) {
                USIOptions.applySetOption(cmd);
            }

            log("> " + cmd);
            onCommand(cmd);
        }
    });

    return { log };
}
