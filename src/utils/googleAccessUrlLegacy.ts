const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const SCOPES = ["https://www.googleapis.com/auth/drive.appdata"];

export default (() => {
  const accessurl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  accessurl.searchParams.set("client_id", CLIENT_ID!);
  accessurl.searchParams.set(
    "redirect_uri",
    "https://api.triple-lab.com/api/v2/tr/legacy"
  );
  accessurl.searchParams.set("response_type", "code");
  accessurl.searchParams.set("scope", SCOPES.join(" "));
  accessurl.searchParams.set("access_type", "offline");
  accessurl.searchParams.set("prompt", "consent");
  return accessurl.toString();
})();
