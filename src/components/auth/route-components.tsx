"use client"

import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ Component }: { Component: () => JSX.Element }) => {
    // Auth placeholders with no reference to fine
    const userSession = null; // TODO: Implement authentication
    const isLoading = false;

    if (isLoading) return <div></div>;
    
    return !userSession?.user ? <Navigate to='/login' /> : <Component />;
};