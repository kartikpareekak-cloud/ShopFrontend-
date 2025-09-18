import { useState } from 'react';

const TestAdminLogin = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAdminLogin = async () => {
    setLoading(true);
    setResult('Testing admin login...');
    
    try {
      const response = await fetch('http://localhost:5004/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'abhishek@gmail.com',
          password: 'Abhi@1234'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ SUCCESS: ${JSON.stringify(data, null, 2)}`);
        
        // Test storing in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        
      } else {
        setResult(`❌ ERROR: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setResult(`
localStorage status:
- Token: ${token ? 'YES' : 'NO'}
- User: ${user || 'NO'}
${user ? `- Parsed User: ${JSON.stringify(JSON.parse(user), null, 2)}` : ''}
    `);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Login Test</h1>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={testAdminLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        <button
          onClick={checkLocalStorage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Check localStorage
        </button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
        {result || 'Click "Test Admin Login" to start...'}
      </pre>
    </div>
  );
};

export default TestAdminLogin;