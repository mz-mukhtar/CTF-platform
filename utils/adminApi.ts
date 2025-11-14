// Utility function to get admin headers for API calls
export function getAdminHeaders(): HeadersInit {
  const adminEmail = localStorage.getItem('ctf_admin_email')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (adminEmail) {
    headers['X-Admin-Email'] = adminEmail
  }
  
  return headers
}

// Helper to make admin API calls
export async function adminApiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...getAdminHeaders(),
    ...options.headers,
  }
  
  return fetch(endpoint, {
    ...options,
    headers,
  })
}

