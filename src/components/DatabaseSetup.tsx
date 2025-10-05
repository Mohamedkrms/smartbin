'use client';

import { useState } from 'react';
import { setupDatabase, testDatabaseConnection, insertSampleData } from '@/utils/database-setup';

export function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      const setupResult = await setupDatabase();
      if (setupResult.success) {
        setResult('message' in setupResult ? setupResult.message || 'Database setup completed successfully!' : 'Database setup completed successfully!');
      } else {
        setError(setupResult.error || 'Setup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      const sampleResult = await insertSampleData();
      if (sampleResult.success) {
        setResult(sampleResult.message || 'Sample data inserted successfully!');
      } else {
        setError(sampleResult.error || 'Sample data insertion failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sample data insertion failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      const testResult = await testDatabaseConnection();
      if (testResult.success) {
        setResult('Database connection successful!');
      } else {
        setError(testResult.error || 'Connection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Database Setup
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : 'Setup Database'}
          </button>
          
          <button
            onClick={handleSampleData}
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Inserting...' : 'Add Sample Data'}
          </button>
        </div>

        {result && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-sm">{result}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li><strong>Test Connection</strong> - Verify your Supabase credentials</li>
            <li><strong>Setup Database</strong> - Checks if tables exist (manual setup required)</li>
            <li><strong>Add Sample Data</strong> - Inserts sample smart bins for testing</li>
            <li>If tables don't exist, you need to run the SQL script manually in Supabase</li>
            <li>Check the browser console for detailed error messages</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>⚠️ Important:</strong> If you get "table does not exist" or "RLS policy" errors:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2 text-xs">
              <li>Go to your Supabase project dashboard</li>
              <li>Click on "SQL Editor" in the sidebar</li>
              <li>Copy the contents of <code>simple-database-setup.sql</code> file</li>
              <li>Paste it into the SQL editor and click "Run"</li>
              <li>If you get RLS errors, also run <code>fix-rls-policies.sql</code></li>
              <li>Come back here and test the connection again</li>
            </ol>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Note:</strong> The SQL script creates all necessary tables (users, smart_bins, collections) 
              with proper Row Level Security (RLS) policies for role-based access control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
