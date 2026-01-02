// index.js
import { createEngine } from "./engine.js";
import { createUI } from "./ui.js";

window.onUSIOptionChanged=(name,value)=>{engine.send(`setoption name ${name} value ${value}`);}

(async () => {
    const ui = createUI({
        onCommand: (cmd) => engine.send(cmd),
    });

    ui.log("Loading engine...");

    const engine = createEngine({
        onMessage: (line) => ui.log(line),
    });

    const Module = await engine.init();
    ui.log("Engine loaded.");

    await engine.loadNNUE("/eval/nn.bin");
    await engine.loadBook("/book/standard_book.db");

    ui.log("Ready.");


})();
