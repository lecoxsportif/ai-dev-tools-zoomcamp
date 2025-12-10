importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;

async function loadPyodideAndPackages() {
    if (!pyodide) {
        pyodide = await loadPyodide();
    }
}

self.onmessage = async (event) => {
    const { code } = event.data;

    try {
        await loadPyodideAndPackages();

        // Redirect stdout
        let output = [];
        pyodide.setStdout({
            batched: (msg) => output.push(msg),
        });

        await pyodide.runPythonAsync(code);

        self.postMessage({ type: 'success', output });
    } catch (err) {
        self.postMessage({ type: 'error', error: err.toString() });
    }
};
