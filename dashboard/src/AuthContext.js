import React, { useState, useContext, useEffect } from "react";
import { auth } from "./firebase";
import { reactLocalStorage } from 'reactjs-localstorage';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  const [currentUser, setcurrentUser] = useState(() => {
    const currentUser = reactLocalStorage.get('currentUser', undefined)
    if (currentUser == undefined) {
      return null
    } else {
      return currentUser
    }
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        reactLocalStorage.set("currentUser", user)
        setcurrentUser(user);
      } else {
        reactLocalStorage.remove("currentUser")
        setcurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
}
