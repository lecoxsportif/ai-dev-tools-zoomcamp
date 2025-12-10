import { expect } from 'chai';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import WebSocket from 'ws';

// Polyfill WebSocket for Node.js environment
global.WebSocket = WebSocket;

describe('CodeView Integration Tests', function () {
    this.timeout(5000);
    const SERVER_URL = 'ws://localhost:1234';
    const TEAM_ID = 'integration-test-room-' + Date.now();

    let doc1, doc2;
    let provider1, provider2;

    beforeEach(() => {
        doc1 = new Y.Doc();
        doc2 = new Y.Doc();
    });

    afterEach(() => {
        if (provider1) provider1.destroy();
        if (provider2) provider2.destroy();
        if (doc1) doc1.destroy();
        if (doc2) doc2.destroy();
    });

    it('should sync text changes between two clients', (done) => {
        // Client 1
        provider1 = new WebsocketProvider(SERVER_URL, TEAM_ID, doc1);

        provider1.on('status', event => {
            if (event.status === 'connected') {
                // Client 2 connects after Client 1
                provider2 = new WebsocketProvider(SERVER_URL, TEAM_ID, doc2);

                provider2.on('status', event2 => {
                    if (event2.status === 'connected') {
                        startTesting();
                    }
                });
            }
        });

        function startTesting() {
            const text1 = doc1.getText('monaco');
            const text2 = doc2.getText('monaco');

            // 1. Client 1 inserts text
            text1.insert(0, 'Hello World');

            // 2. Wait for sync
            setTimeout(() => {
                try {
                    expect(text2.toString()).to.equal('Hello World');

                    // 3. Client 2 appends text
                    text2.insert(11, '!');

                    setTimeout(() => {
                        try {
                            expect(text1.toString()).to.equal('Hello World!');
                            done();
                        } catch (e) {
                            done(e);
                        }
                    }, 100);

                } catch (e) {
                    done(e);
                }
            }, 100);
        }
    });
});
