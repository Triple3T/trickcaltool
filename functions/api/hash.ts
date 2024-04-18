export async function onRequestGet({ env }) {
    const response = new Response(env.CF_PAGES_COMMIT_SHA);
    return response;
  }
  