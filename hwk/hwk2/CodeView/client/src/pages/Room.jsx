import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { runCode } from '../utils/codeRunner';

const Room = () => {
    const { roomId } = useParams();
    const [editorRef, setEditorRef] = useState(null);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState('javascript');

    const handleEditorMount = (editor) => {
        setEditorRef(editor);
    };

    const handleRunCode = async () => {
        if (!editorRef) return;

        setIsRunning(true);
        setOutput([]);

        const code = editorRef.getValue();
        const result = await runCode(code, language);

        setOutput(result.output);
        setIsRunning(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">CodeView Room: {roomId}</h1>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>
                </div>
                <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded font-bold transition-colors ${isRunning
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </header>
            <main className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-hidden h-[calc(100vh-64px)]">
                <div className="bg-gray-800 rounded p-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
                    <div className="flex-1 border border-gray-700 overflow-hidden relative">
                        <CodeEditor roomId={roomId} onEditorMount={handleEditorMount} language={language} />
                    </div>
                </div>
                <div className="bg-gray-800 rounded p-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold mb-2">Output</h2>
                    <div className="flex-1 bg-black p-4 font-mono text-sm overflow-auto whitespace-pre-wrap text-green-400 rounded">
                        {output.length > 0 ? (
                            output.map((line, i) => <div key={i}>{line}</div>)
                        ) : (
                            <span className="text-gray-500">// Console output will appear here</span>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Room;
