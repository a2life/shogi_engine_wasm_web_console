// usi_options.js
// Parses USI option lines and stores defaults + overrides.

window.USIOptions = (() => {

    const options = [];          // Parsed from "option name ..." lines
    const overrides = {};        // From setoption commands

    // Parse a single "option name ..." line
    function parseOptionLine(line) {
        // Example:
        // option name Hash type spin default 16 min 1 max 1024
        const tokens = line.split(/\s+/);
        const obj = { name: "", type: "", default: null, min: null, max: null, values: [], value: null };

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
                    obj.value = val; // initial value = default
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
        }
    }

    // Called when user enters "setoption name X value Y"
    function applySetOption(cmd) {
        const m = cmd.match(/setoption name (.+?) value (.+)/);
        if (!m) return;

        const name = m[1];
        const value = m[2];

        overrides[name] = value;

        const opt = options.find(o => o.name === name);
        if (opt) opt.value = value;
    }

    return {
        feedEngineLine,
        applySetOption,
        getOptions: () => options,
        getOverrides: () => overrides
    };
})();
