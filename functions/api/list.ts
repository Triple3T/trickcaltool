const attachableQuery = (params: { [key: string]: string }) =>
    Object.entries(params)
      .map((p) => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
      .join('&');
  
  export async function onRequestGet({ request }) {
    const auth: string = request.headers.get('authorization') || request.headers.get('Authorization');
    const url = 'https://www.googleapis.com/drive/v3/files';
    const params = {
      spaces: 'appDataFolder',
      q: "name='trickcal-note-sync.txt'",
      fields: 'files(id)',
    };
    const options = {
      method: 'GET',
      headers: {
        Authorization: auth,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    };
    const res = await fetch(`${url}?${attachableQuery(params)}`, options);
    return res;
  }
  