'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, isAuthenticated } from '@/lib/api-client';
import { getExploreBundles, getExploreSessions, getExploreCommunities, getExploreInstructors } from '@/lib/api-client';

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [bundlesResponse, setBundlesResponse] = useState<{
    success: boolean;
    data?: unknown;
    length?: number;
    error?: string;
  } | null>(null);
  const [sessionsResponse, setSessionsResponse] = useState<{
    success: boolean;
    data?: unknown;
    length?: number;
    error?: string;
  } | null>(null);
  const [communitiesResponse, setCommunitiesResponse] = useState<{
    success: boolean;
    data?: unknown;
    length?: number;
    error?: string;
  } | null>(null);
  const [instructorsResponse, setInstructorsResponse] = useState<{
    success: boolean;
    data?: unknown;
    length?: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    // Check authentication status
    const token = getAuthToken();
    const authenticated = isAuthenticated();

    setAuthStatus(`Token: ${token ? 'Present' : 'Missing'}, Authenticated: ${authenticated}`);

    // Test API calls
    const testAPIs = async () => {
      try {
        console.log('🧪 Testing API calls...');

        // Test bundles
        try {
          const bundles = await getExploreBundles();
          setBundlesResponse({ success: true, data: bundles, length: bundles?.length || 0 });
          console.log('✅ Bundles API:', bundles);
        } catch (error) {
          setBundlesResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
          console.error('❌ Bundles API Error:', error);
        }

        // Test sessions
        try {
          const sessions = await getExploreSessions();
          setSessionsResponse({ success: true, data: sessions, length: sessions?.length || 0 });
          console.log('✅ Sessions API:', sessions);
        } catch (error) {
          setSessionsResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
          console.error('❌ Sessions API Error:', error);
        }

        // Test communities
        try {
          const communities = await getExploreCommunities();
          setCommunitiesResponse({ success: true, data: communities, length: communities?.length || 0 });
          console.log('✅ Communities API:', communities);
        } catch (error) {
          setCommunitiesResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
          console.error('❌ Communities API Error:', error);
        }

        // Test instructors
        try {
          const instructors = await getExploreInstructors();
          setInstructorsResponse({ success: true, data: instructors, length: instructors?.length || 0 });
          console.log('✅ Instructors API:', instructors);
        } catch (error) {
          setInstructorsResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
          console.error('❌ Instructors API Error:', error);
        }

      } catch (error) {
        console.error('❌ General API test error:', error);
      }
    };

    testAPIs();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 API Debug Page</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p>{authStatus}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Bundles API</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(bundlesResponse, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Sessions API</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(sessionsResponse, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Communities API</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(communitiesResponse, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Instructors API</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(instructorsResponse, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser console (F12) to see detailed logs</li>
          <li>Check if authentication token is present</li>
          <li>Verify API responses are successful</li>
          <li>If APIs fail with 401, you need to log in first</li>
        </ol>
      </div>
    </div>
  );
}
