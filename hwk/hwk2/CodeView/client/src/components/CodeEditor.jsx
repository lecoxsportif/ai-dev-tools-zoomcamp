import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

const CodeEditor = ({ roomId, onEditorMount, language = 'javascript' }) => {
    const editorRef = useRef(null);
    const providerRef = useRef(null);
    const docRef = useRef(null);
    const bindingRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        // 1. Create Yjs Doc and Provider
        const doc = new Y.Doc();
        const provider = new WebsocketProvider(
            'ws://localhost:1234',
            roomId,
            doc
        );

        docRef.current = doc;
        providerRef.current = provider;

        // 2. Bind if editor is already mounted
        if (editorRef.current) {
            const type = doc.getText('monaco');
            bindingRef.current = new MonacoBinding(
                type,
                editorRef.current.getModel(),
                new Set([editorRef.current]),
                provider.awareness
            );
        }

        return () => {
            // Cleanup
            if (bindingRef.current) {
                bindingRef.current.destroy();
                bindingRef.current = null;
            }
            provider.destroy();
            doc.destroy();
            providerRef.current = null;
            docRef.current = null;
        };
    }, [roomId]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        if (onEditorMount) {
            onEditorMount(editor);
        }

        // If provider already execution, bind it
        if (docRef.current && providerRef.current && !bindingRef.current) {
            const type = docRef.current.getText('monaco');
            bindingRef.current = new MonacoBinding(
                type,
                editor.getModel(),
                new Set([editor]),
                providerRef.current.awareness
            );
        }
    };

    return (
        <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
            }}
        />
    );
};

export default CodeEditor;
