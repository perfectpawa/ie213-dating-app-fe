import React, { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../hooks/useAuth';

export const ChatDebug: React.FC = () => {
    const { user } = useAuth();
    const [testResults, setTestResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);

    // Get available users for testing
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // You might need to create an endpoint to get all users
                // For now, let's use a hardcoded test user ID
                setAvailableUsers([
                    { _id: "674b1e7b8ee25c8a1b6f4b3b", user_name: "Test User" }
                ]);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const addResult = (result: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    };

    const testGetConversations = async () => {
        if (!user?._id) {
            addResult('❌ User not logged in');
            return;
        }
        
        try {
            addResult('🔄 Testing getConversations...');
            addResult(`📡 Calling: GET /api/messages/conversations?userId=${user._id}`);
            
            const response = await chatApi.getConversations(user._id);
            addResult(`✅ Response status: ${response ? 'Success' : 'Failed'}`);
            addResult(`📄 Conversations data: ${JSON.stringify(response?.data, null, 2)}`);
        } catch (error: any) {
            addResult(`❌ Error: ${error.message}`);
            addResult(`🔍 Error details: ${JSON.stringify(error.response?.data || error, null, 2)}`);
        }
    };    const testSendMessage = async () => {
        if (!user?._id) {
            addResult('❌ User not logged in');
            return;
        }

        // First get real matched users
        let testReceiverId = "674b1e7b8ee25c8a1b6f4b3b"; // fallback
        
        try {
            const conversationsResponse = await chatApi.getConversations(user._id);
            if (conversationsResponse?.data?.conversations?.length > 0) {
                testReceiverId = conversationsResponse.data.conversations[0].user._id;
                addResult(`🎯 Using real matched user: ${testReceiverId}`);
            } else {
                addResult(`⚠️ No conversations found, using fallback ID`);
            }
        } catch (error) {
            addResult(`⚠️ Error getting conversations, using fallback ID`);
        }

        const testMessage = `Test message at ${new Date().toLocaleTimeString()}`;
        
        try {
            addResult('🔄 Testing sendMessage...');
            addResult(`📡 Calling: POST /api/messages`);
            addResult(`📝 Payload: { receiverId: "${testReceiverId}", content: "${testMessage}" }`);
            
            const response = await chatApi.sendMessage(testReceiverId, testMessage);
            addResult(`✅ Message sent successfully!`);
            // Show the full response structure to debug
            addResult(`📄 Full Response: ${JSON.stringify(response, null, 2)}`);
            addResult(`📄 Response Data: ${JSON.stringify(response?.data, null, 2)}`);
        } catch (error: any) {
            addResult(`❌ Send message error: ${error.message}`);
            addResult(`🔍 Error response: ${JSON.stringify(error.response?.data || error, null, 2)}`);
            addResult(`🔍 Error status: ${error.response?.status}`);
        }
    };    const testGetMessages = async () => {
        if (!user?._id) {
            addResult('❌ User not logged in');
            return;
        }

        // Use the real matched user instead of hardcoded fallback
        let testOtherUserId = "674b1e7b8ee25c8a1b6f4b3b"; // fallback
        
        try {
            const conversationsResponse = await chatApi.getConversations(user._id);
            if (conversationsResponse?.data?.conversations?.length > 0) {
                testOtherUserId = conversationsResponse.data.conversations[0].user._id;
                addResult(`🎯 Using real matched user: ${testOtherUserId}`);
            } else {
                addResult(`⚠️ No conversations found, using fallback ID`);
            }
        } catch (error) {
            addResult(`⚠️ Error getting conversations, using fallback ID`);
        }
        
        try {
            addResult('🔄 Testing getMessages...');
            addResult(`📡 Calling: GET /api/messages/conversations/${testOtherUserId}?userId=${user._id}`);
            
            const response = await chatApi.getConversation(user._id, testOtherUserId);
            addResult(`✅ Messages retrieved successfully!`);
            addResult(`📄 Messages: ${JSON.stringify(response?.data, null, 2)}`);
        } catch (error: any) {
            addResult(`❌ Get messages error: ${error.message}`);
            addResult(`🔍 Error details: ${JSON.stringify(error.response?.data || error, null, 2)}`);
        }
    };    const testAuthentication = async () => {
        try {
            addResult('🔄 Testing authentication...');
            addResult(`🔑 Current user: ${user?.email || 'None'}`);
            addResult(`🆔 User ID: ${user?._id || 'None'}`);
            
            // Check if we have a token
            const token = localStorage.getItem('token');
            addResult(`🎫 Token exists: ${token ? 'Yes' : 'No'}`);
            addResult(`🎫 Token preview: ${token ? token.substring(0, 20) + '...' : 'None'}`);
            
            // Test if the match exists
            if (user?._id) {
                try {
                    const conversationsResponse = await chatApi.getConversations(user._id);
                    if (conversationsResponse?.data?.conversations?.length > 0) {
                        const matchedUser = conversationsResponse.data.conversations[0].user;
                        addResult(`🎯 Found matched user: ${matchedUser.username} (${matchedUser._id})`);
                        addResult(`📧 Matched user email: ${matchedUser.email}`);
                    }
                } catch (error: any) {
                    addResult(`⚠️ Could not check matches: ${error.message}`);
                }
            }
        } catch (error: any) {
            addResult(`❌ Auth test error: ${error.message}`);
        }
    };

    const runAllTests = async () => {
        setLoading(true);
        setTestResults([]);
        
        addResult('🚀 Starting comprehensive chat API tests...');
        
        await testAuthentication();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testGetConversations();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testGetMessages();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testSendMessage();
        
        addResult('✅ All tests completed!');
        setLoading(false);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Chat API Debug Tool</h2>
            
            <div className="mb-4 space-y-2">
                <div className="text-sm bg-white p-3 rounded">
                    <strong>Current User:</strong> {user?.email || 'Not logged in'} 
                    <br />
                    <strong>User ID:</strong> {user?._id || 'None'}
                    <br />
                    <strong>Auth Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <button 
                    onClick={testAuthentication}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                    Test Authentication
                </button>
                
                <button 
                    onClick={testGetConversations}
                    disabled={loading || !user}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
                >
                    Test Get Conversations
                </button>
                
                <button 
                    onClick={testGetMessages}
                    disabled={loading || !user}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
                >
                    Test Get Messages
                </button>
                
                <button 
                    onClick={testSendMessage}
                    disabled={loading || !user}
                    className="bg-purple-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
                >
                    Test Send Message
                </button>
                
                <button 
                    onClick={runAllTests}
                    disabled={loading || !user}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
                >
                    {loading ? 'Running Tests...' : 'Run All Tests'}
                </button>
                
                <button 
                    onClick={clearResults}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Clear Results
                </button>
            </div>

            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                    <div className="text-gray-500">No test results yet. Click a test button to start.</div>
                ) : (
                    testResults.map((result, index) => (
                        <div key={index} className="mb-1">
                            {result}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p><strong>Debug Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>First run "Test Authentication" to verify you're logged in</li>
                    <li>Check browser Network tab when running tests</li>
                    <li>Verify backend server is running on port 8000</li>
                    <li>Check backend console for error logs</li>
                </ol>
            </div>
        </div>
    );
};

export default ChatDebug;
