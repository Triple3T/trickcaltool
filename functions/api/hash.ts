export async function onRequestGet({ env }) {
    const response = new Response(env.CF_PAGES_COMMIT_SHA);
    response.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.append('Pragma', 'no-cache');
    return response;
  }
  