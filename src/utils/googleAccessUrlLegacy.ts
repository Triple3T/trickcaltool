const SCOPES = ["https://www.googleapis.com/auth/drive.appdata"];

export default (() => {
  const accessurl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  accessurl.searchParams.set(
    "client_id",
    "637944158863-l548alrsg15njgk49kpaq13d5gnijo3j.apps.googleusercontent.com"
  );
  accessurl.searchParams.set(
    "redirect_uri",
    `${process.env.API_HOSTNAME}/api/v3/tr/legacy`
  );
  accessurl.searchParams.set("response_type", "code");
  accessurl.searchParams.set("scope", SCOPES.join(" "));
  accessurl.searchParams.set("access_type", "offline");
  accessurl.searchParams.set("prompt", "consent");
  return accessurl.toString();
})();
