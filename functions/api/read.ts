const attachableQuery = (params: { [key: string]: string }) =>
    Object.entries(params)
      .map((p) => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
      .join('&');
  
  export async function onRequestGet({ request }) {
    const auth: string = request.headers.get('authorization') || request.headers.get('Authorization');
    const fileId = new URL(request.url).searchParams.get('id');
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const params = {
      spaces: 'appDataFolder',
      fileId,
      alt: 'media',
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
  