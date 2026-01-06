// engine.js
import { applyOrQueueOverride, feedEngineLine } from "./usi_options.js";

export function createEngine({ onMessage }) {
    let Module = null;
    let suppressUsiOutput = true;

    async function loadBinaryFile(url) {
        const response = await fetch(url);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const filename = url.split("/").pop();
        Module.FS.writeFile("/" + filename, bytes);
        return filename;
    }

    async function loadNNUE(url) {
        const filename = await loadBinaryFile(url);

        applyOrQueueOverride("EvalDir", ".");
        applyOrQueueOverride("EvalFile", filename);
        applyOrQueueOverride("FV_SCALE", "24");

        Module.postMessage("setoption name EvalDir value .");
        Module.postMessage(`setoption name EvalFile value ${filename}`);
        Module.postMessage(`setoption name FV_SCALE value 24`);
    }

    async function loadBook(url) {
        const filename = await loadBinaryFile(url);

        applyOrQueueOverride("BookDir", ".");
        applyOrQueueOverride("BookFile", filename);

        Module.postMessage("setoption name BookDir value .");
        Module.postMessage(`setoption name BookFile value ${filename}`);
    }

    async function init() {
        Module = await window.YaneuraOu_HalfKP_noeval({
            locateFile: (path) => "/lib/" + path,
            print: (line) => onMessage(line),
            printErr: (line) => onMessage(line),
        });

        Module.addMessageListener((line) => {
            feedEngineLine(line);

            if (suppressUsiOutput) {
                if (line === "usiok") suppressUsiOutput = false;
                return;
            }

            onMessage(line);
        });

        Module.postMessage("usi"); //gather option name and values info
        return Module;
    }

    return {
        init,
        loadNNUE,
        loadBook,
        send: (cmd) => Module.postMessage(cmd),
    };
}
