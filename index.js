function log(msg) {
    const el = document.getElementById("log");
    el.textContent += msg + "\n";
    el.scrollTop = el.scrollHeight;
}

// Shared helper for loading a binary file into the Module FS
async function loadBinaryFile(Module, url) {
    const response = await fetch(url);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const filename = url.split("/").pop();
    Module.FS.writeFile("/" + filename, bytes);
    return filename;
}

// Load NNUE using the shared helper + queued overrides
async function loadNNUE(Module, url) {
    const filename = await loadBinaryFile(Module, url);

    // Queue or apply overrides
    USIOptions.applyOrQueueOverride("EvalDir", ".");
    USIOptions.applyOrQueueOverride("EvalFile", filename);
    USIOptions.applyOrQueueOverride("FV_SCALE", "24");

    // Send engine commands
    Module.postMessage("setoption name EvalDir value .");
    Module.postMessage(`setoption name EvalFile value ${filename}`);
    Module.postMessage(`setoption name FV_SCALE value 24`);

    log("NNUE loaded: " + filename);
}

// Load Book using the shared helper + queued overrides
async function loadBook(Module, url) {
    const filename = await loadBinaryFile(Module, url);

    // Queue or apply overrides
    USIOptions.applyOrQueueOverride("BookDir", ".");
    USIOptions.applyOrQueueOverride("BookFile", filename);

    // Send engine commands
    Module.postMessage("setoption name BookDir value .");
    Module.postMessage(`setoption name BookFile value ${filename}`);

    log("Book loaded: " + filename);
}

(async () => {
    log("Loading engine...");

    // Call the global function created by the loader
    const Module = await window.YaneuraOu_HalfKP_noeval({
        locateFile: (path) => "/lib/" + path,
        print: log,
        printErr: log,
    });

    log("Engine loaded.");

    // Capture messages from engine
    Module.addMessageListener((line) => {
        USIOptions.feedEngineLine(line);

        if (suppressUsiOutput) {
            if (line === "usiok") {
                suppressUsiOutput = false;
            }
            return;
        }

        log(line);
    });

    // Load NNUE + Book
    await loadNNUE(Module, "/eval/nn.bin");
    await loadBook(Module, "/book/standard_book.db");

    log("Ready.");

    // Input handler
    const input = document.getElementById("input");
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.trim();

            if (cmd.startsWith("setoption")) {
                USIOptions.applySetOption(cmd);
            }

            input.value = "";
            log("> " + cmd);
            Module.postMessage(cmd);
        }
    });

    window.Yaneura = Module;

    // Hide USI startup noise
    let suppressUsiOutput = true;

    // Trigger USI automatically
    Module.postMessage("usi");
})();
