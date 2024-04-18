interface GoogleAuthRes {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }
  
  const rfCookieName = 'X-Gapi-Refresh-Token';
  
  export async function onRequestGet({ request, env }) {
    const cookie: string = request.headers.get('cookie') || request.headers.get('Cookie');
    if (!cookie || !cookie.includes(`${rfCookieName}=`))
      return new Response('No cookie', { status: 401 });
    const token = cookie
      .split(';')
      .map((c) => c.trim().split('='))
      .find((c) => c[0] === rfCookieName)[1];
  
    const url = 'https://oauth2.googleapis.com/token';
  
    const bodyObject = {
      refresh_token: token,
      client_id: env.REACT_APP_GAPI_CLIENT_ID,
      client_secret: env.GAPI_CLIENT_SECRET,
      grant_type: 'refresh_token',
    };
  
    const body = JSON.stringify(bodyObject);
  
    const options = {
      method: 'POST',
      headers: { Accept: '*/*', 'Content-Type': 'application/json' },
      body,
    };
  
    const res = await fetch(url, options);
    if (!res.ok) return new Response('Error', { status: res.status });
    const data = await res.json();
    const accessToken = (data as GoogleAuthRes).access_token;
  
    const response = new Response(accessToken);
    return response;
  }
  