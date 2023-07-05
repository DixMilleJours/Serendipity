import { Navigate, Outlet } from 'react-router';
import React, { useEffect } from 'react';
import { useAPI } from './UserContext';

function ProtectedRoutes() {
    var token = localStorage.getItem('ltoken');
    const { user } = useAPI();

    useEffect(() => {

        if (user.token === token) {
            token = user.token;
        }else{
            token = null;
        }

        if (token === null) {
            return null;
        }

    }, []);
    return (
        <>
            {!token ? <Outlet /> : <Navigate to='/' />}
        </>
    )
}



export default ProtectedRoutes;