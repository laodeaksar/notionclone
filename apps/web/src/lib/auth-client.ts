import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
  baseURL: "",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
