"use client";

import React,{ createContext } from "react";

type AuthContextProviderProps = {
  children: React.ReactNode;
}

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children } : AuthContextProviderProps){

}