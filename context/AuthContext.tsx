import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  User,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { Container } from "@/components/Container";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

const GithubProvider = new GithubAuthProvider();
const GoogleProvider = new GoogleAuthProvider();

const AuthContext = createContext<{
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,

  loginWithGoogle: async () => {},
  logout: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [signingIn, setSigningIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  //   const loginWithGithub = async () => {
  //     if (!auth) return console.log(Error("Firebase is not configured")); // This is to handle error when there is no `.env` file. So, that app doesn't crash while developing without `.env` file.
  //     try {
  //       await signInWithPopup(auth, GithubProvider);
  //       toast.success("Signed in Successfully");
  //     } catch (error) {
  //       console.log("Error while logging in", error);
  //     }
  //   };

  const loginWithGoogle = async () => {
    if (!auth) return console.log(Error("Firebase is not configured")); // This is to handle error when there is no `.env` file. So, that app doesn't crash while developing without `.env` file.
    setSigningIn(true);
    try {
      await signInWithPopup(auth, GoogleProvider);
      toast.success("Signed in Successfully");
    } catch (error) {
      console.log("Error while logging in", error);
      toast.error(`Error while logging in, ${error}`);
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    if (!auth) return console.log(Error("Firebase is not configured")); // This is to handle error when there is no `.env` file. So, that app doesn't crash while developing without `.env` file.
    await signOut(auth);

    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (!auth) return console.log(Error("Firebase is not configured")); // This is to handle error when there is no `.env` file. So, that app doesn't crash while developing without `.env` file.
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {signingIn ? (
        <Container>
          <Loader />
        </Container>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider, AuthContext };
