// usi_options_dialog.js
// Builds a dynamic dialog for editing USI options.

// usi_options_dialog.js

window.USIOptionsDialog = (() => {

    function createDialog() {
        const container = document.getElementById("usi-options-dialog");
        container.innerHTML = "";

        const opts = USIOptions.getOptions();

        // Scrollable content area
        const scrollArea = document.createElement("div");
        scrollArea.className = "usi-options-scroll";

        const form = document.createElement("div");
        form.className = "usi-options-form";

        opts.forEach(opt => {
            const row = document.createElement("div");
            row.className = "usi-option-row";

            const label = document.createElement("label");
            label.textContent = opt.name;

            let input;

            if (opt.type === "spin") {
                input = document.createElement("input");
                input.type = "number";
                input.min = opt.min;
                input.max = opt.max;
                input.value = opt.value;
            } else if (opt.type === "check") {
                input = document.createElement("input");
                input.type = "checkbox";
                input.checked = opt.value === "true";
            } else if (opt.type === "combo") {
                input = document.createElement("select");
                opt.values.forEach(v => {
                    const o = document.createElement("option");
                    o.value = v;
                    o.textContent = v;
                    if (v === opt.value) o.selected = true;
                    input.appendChild(o);
                });
            } else {
                input = document.createElement("input");
                input.type = "text";
                input.value = opt.value;
            }

            input.dataset.optionName = opt.name;

            row.appendChild(label);
            row.appendChild(input);
            form.appendChild(row);
        });

        scrollArea.appendChild(form);
        container.appendChild(scrollArea);

        // Buttons
        const btnRow = document.createElement("div");
        btnRow.className = "usi-option-buttons";

        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply";
        applyBtn.onclick = () => applyChanges(form);

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = () => (container.style.display = "none");

        btnRow.appendChild(applyBtn);
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);

        container.style.display = "block";
    }

    function applyChanges(form) {
        const inputs = form.querySelectorAll("[data-option-name]");

        inputs.forEach(input => {
            const name = input.dataset.optionName;
            let value;

            if (input.type === "checkbox") {
                value = input.checked ? "true" : "false";
            } else {
                value = input.value;
            }

            USIOptions.applySetOption(`setoption name ${name} value ${value}`);
            window.Yaneura.postMessage(`setoption name ${name} value ${value}`);
        });

        document.getElementById("usi-options-dialog").style.display = "none";
    }

    return {
        open: createDialog
    };
})();
