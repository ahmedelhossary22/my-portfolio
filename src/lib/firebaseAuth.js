// Only the admin page imports this file, so the public portfolio never
// loads Firebase Auth.
import { getAuth } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);
