const runJs = (code) => {
  return new Promise((resolve) => {
    const blob = new Blob([`
      self.onmessage = function(e) {
        const code = e.data;
        let output = [];
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          output.push(args.map(a => String(a)).join(' '));
        };
        try {
          const result = new Function(code)();
          if (result !== undefined) {
             console.log(result);
          }
          self.postMessage({ type: 'success', output });
        } catch (err) {
          self.postMessage({ type: 'error', error: err.toString() });
        }
      };
    `], { type: 'application/javascript' });

    const worker = new Worker(URL.createObjectURL(blob));
    let timeout = setTimeout(() => {
      worker.terminate();
      resolve({ output: ['Error: Execution timed out (5s limit)'] });
    }, 5000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      if (e.data.type === 'success') {
        resolve({ output: e.data.output });
      } else {
        resolve({ output: [e.data.error] });
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      clearTimeout(timeout);
      resolve({ output: ['Error: ' + e.message] });
      worker.terminate();
    };

    worker.postMessage(code);
  });
};

const runPython = (code) => {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('../workers/pythonWorker.js', import.meta.url), {
      type: 'classic' // classic because the worker uses importScripts
    });

    let timeout = setTimeout(() => {
      worker.terminate();
      resolve({ output: ['Error: Execution timed out (35s limit for Python run)'] });
    }, 35000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      if (e.data.type === 'success') {
        resolve({ output: e.data.output });
      } else {
        resolve({ output: [e.data.error] });
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      clearTimeout(timeout);
      console.error(e);
      resolve({ output: ['Error: Worker Error (Check console)'] });
      worker.terminate();
    };

    worker.postMessage({ code });
  });
};

export const runCode = async (code, language = 'javascript') => {
  if (language === 'python') {
    return runPython(code);
  }
  return runJs(code);
};
