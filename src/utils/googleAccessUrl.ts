const CLIENT_ID = '637944158863-l548alrsg15njgk49kpaq13d5gnijo3j.apps.googleusercontent.com';

const SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];

export default (() => {
  const accessurl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  accessurl.searchParams.set('client_id', CLIENT_ID!);
  accessurl.searchParams.set('redirect_uri', 'https://tr.triple-lab.com/code');
  accessurl.searchParams.set('response_type', 'code');
  accessurl.searchParams.set('scope', SCOPES.join(' '));
  accessurl.searchParams.set('access_type', 'offline');
  accessurl.searchParams.set('prompt', 'consent');
  return accessurl.toString();
})();