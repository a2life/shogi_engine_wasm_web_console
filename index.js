// index.js
import { createEngine } from "./engine.js";
import { createUI } from "./ui.js";
import { open as openOptionsDialog, setOptionChangedCallback } from "./usi_options_dialog.js";

// Make dialog accessible globally for the button
window.openUSIOptionsDialog = openOptionsDialog;

(async () => {
    const ui = createUI({
        onCommand: (cmd) => engine.send(cmd),
    });

    ui.log("Loading engine...");

    const engine = createEngine({
        onMessage: (line) => ui.log(line),
    });

    // Set up callback for when options change in dialog
    setOptionChangedCallback((name, value) => {
        engine.send(`setoption name ${name} value ${value}`);
    });

    const Module = await engine.init();
    ui.log("Engine loaded.");

    await engine.loadNNUE("/eval/nn.bin");
    await engine.loadBook("/book/standard_book.db");

    ui.log("Ready.");
})();
