function log(msg) {
    const el = document.getElementById("log");
    el.textContent += msg + "\n";
    el.scrollTop = el.scrollHeight;
}

async function loadNNUE(Module, url) {
    const response = await fetch(url);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const filename = url.split("/").pop();

    Module.FS.writeFile("/" + filename, bytes);
    Module.postMessage("setoption name EvalDir value .");
    Module.postMessage(`setoption name EvalFile value ${filename}`);
    Module.postMessage(`setoption name FV_SCALE value 24`);


    log("NNUE loaded: " + filename);
}
async function loadBook(Module, url) {
    const response = await fetch(url);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const filename = url.split("/").pop();

    Module.FS.writeFile("/" + filename, bytes);
    Module.postMessage("setoption name BookDir value .");
    Module.postMessage(`setoption name BookFile value ${filename}`);

    log("Book loaded: " + filename);
}


(async () => {
    log("Loading engine...");

    // Call the global function created by the loader
    const Module = await window.YaneuraOu_HalfKP_noeval({
        locateFile: (path) => "/lib/" + path,
        print: log,  //catche's main-thread prints
        printErr: log, //catche's error'
    });


    log("Engine loaded.");

    //capture the messages from the engine to debug console and feed to log
    Module.addMessageListener((line) => {
        log(line);
    })

    await loadNNUE(Module, "/eval/nn.bin");

    await loadBook(Module, "/book/standard_book.db");

    log("Ready.");

    const input = document.getElementById("input");
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.trim();
            input.value = "";
            log("> " + cmd);
            Module.postMessage(cmd);
        }
    });
    window.Yaneura = Module;
})();
