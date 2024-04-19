interface GoogleAuthRes {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    refresh_token: string;
  }
  
  const rfCookieName = 'X-Gapi-Refresh-Token';
  
  export async function onRequestGet({ request, env }) {
    const code = new URL(request.url).searchParams.get('code');
  
    const url = 'https://oauth2.googleapis.com/token';
  
    const bodyObject = {
      code,
      client_id: env.REACT_APP_GAPI_CLIENT_ID,
      client_secret: env.GAPI_CLIENT_SECRET,
      redirect_uri: 'https://tr.triple-lab.com/code',
      grant_type: 'authorization_code',
    };
  
    const body = JSON.stringify(bodyObject);
  
    const options = {
      method: 'POST',
      headers: { Accept: '*/*', 'Content-Type': 'application/json' },
      body,
    };
  
    const res = await fetch(url, options);
    if (!res.ok) {
      res.body.cancel();
      return new Response('Error', { status: res.status });
    }
    const data = await res.json();
    const refreshToken = (data as GoogleAuthRes).refresh_token;
  
    const response = new Response('<script>window.close()</script>');
    response.headers.append('Content-Type', 'text/html');
    response.headers.append(
      'Set-Cookie',
      `${rfCookieName}=${refreshToken}; Max-Age=315360000; Path=/; Secure; HttpOnly;`
    );
    return response;
  }
  