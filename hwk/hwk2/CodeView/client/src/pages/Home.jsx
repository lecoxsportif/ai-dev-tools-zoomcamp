import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');

    const createRoom = () => {
        const id = uuidv4();
        navigate(`/room/${id}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-4xl font-bold mb-8">CodeView</h1>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={createRoom}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-6 transition duration-200"
                >
                    Create New Room
                </button>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <form onSubmit={joinRoom} className="space-y-4">
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                            Join Existing Room
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                    >
                        Join Room
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
