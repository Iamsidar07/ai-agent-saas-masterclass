const issuerUrl = process.env.CLERK_ISSUER_URL;
if (!issuerUrl) throw new Error("Missing issuer url CLERK_ISSUER_URL");

const authConfig = {
  providers: [
    {
      domain: issuerUrl,
      applicationID: "convex",
    },
  ],
};
export default authConfig;
