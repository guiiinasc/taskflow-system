"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AuthModal } from "../components/modals/AuthModal";

type AuthModalContextType = {
    isOpen: boolean;
    mode: "login" | "register";
    openLogin: () => void;
    openRegister: () => void;
    close: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    const openLogin = useCallback(() => {
        setMode("login");
        setIsOpen(true);
    }, []);

    const openRegister = useCallback(() => {
        setMode("register");
        setIsOpen(true);
    }, []);

    const close = useCallback(() => setIsOpen(false), []);

    return (
        <AuthModalContext.Provider value={{ isOpen, mode, openLogin, openRegister, close }}>
            {children}
            <AuthModal
                isOpen={isOpen}
                mode={mode}
                setMode={setMode} 
                onClose={close}
            />    </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const ctx = useContext(AuthModalContext);
    if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
    return ctx;
}
