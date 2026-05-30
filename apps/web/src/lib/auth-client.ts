import { createAuthClient } from "better-auth/svelte";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "",
  plugins: [organizationClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
