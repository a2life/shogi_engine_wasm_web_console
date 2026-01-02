// usi_options.js
// Parses USI option lines and stores defaults + overrides.
// Now includes a queue system so overrides applied before "usiok"
// are safely stored and applied once ready.

window.USIOptions = (() => {

    const options = [];      // Parsed from "option name ..." lines
    const overrides = {};    // Final applied overrides

    // New: queue + ready flag
    let pendingOverrides = [];
    let ready = false;

    // Parse a single "option name ..." line
    function parseOptionLine(line) {
        const tokens = line.split(/\s+/);
        const obj = {
            name: "",
            type: "",
            default: null,
            min: null,
            max: null,
            values: [],
            value: null
        };

        let i = 1; // skip "option"
        while (i < tokens.length) {
            const key = tokens[i];
            const val = tokens[i + 1];

            switch (key) {
                case "name":
                    obj.name = val;
                    i += 2;
                    break;
                case "type":
                    obj.type = val;
                    i += 2;
                    break;
                case "default":
                    obj.default = val;
                    obj.value = val;
                    i += 2;
                    break;
                case "min":
                    obj.min = Number(val);
                    i += 2;
                    break;
                case "max":
                    obj.max = Number(val);
                    i += 2;
                    break;
                case "var":
                    obj.values.push(val);
                    i += 2;
                    break;
                default:
                    i++;
            }
        }

        options.push(obj);
    }

    // Called when engine prints a line
    function feedEngineLine(line) {
        if (line.startsWith("option ")) {
            parseOptionLine(line);
            return;
        }

        // Detect end of USI option list
        if (line === "usiok") {
            ready = true;

            // Apply queued overrides
            for (const { key, value } of pendingOverrides) {
                setOverride(key, value);
            }
            pendingOverrides = [];
        }
    }

    // Internal: apply override immediately
    function setOverride(key, value) {
        overrides[key] = value;

        const opt = options.find(o => o.name === key);
        if (opt) {
            opt.value = value;
        }
    }

    // Public: apply override or queue it
    function applyOrQueueOverride(key, value) {
        if (ready) {
            setOverride(key, value);
        } else {
            pendingOverrides.push({ key, value });
        }
    }

    // Called when user enters "setoption name X value Y"
    function applySetOption(cmd) {
        const m = cmd.match(/setoption name (.+?) value (.+)/);
        if (!m) return;

        const name = m[1];
        const value = m[2];

        applyOrQueueOverride(name, value);
    }

    return {
        feedEngineLine,
        applySetOption,
        applyOrQueueOverride,
        getOptions: () => options,
        getOverrides: () => overrides
    };

})();
