import React, { useContext, useState, useEffect, createContext } from "react";
import axios from "axios";

const UserContext = createContext();

function UserContextProvider({ children }) {
    // Initialize state
    const [user, setUser] = useState({ 'username': '', 'email': '', 'login': false, 'token': '' });
    const [isLoading, setIsLoading] = useState(true);
    var token = localStorage.getItem('ltoken');
    // Fetch data
    useEffect(() => {
        let url = "http://localhost:8000/user/index";
        if (token != null) {
            axios
                .get(url,
                    { headers: { 'Content-Type': 'application/json', 'authorization': token } }
                )
                .then(res => {
                    // use loading state to show the user info after the elements are rendered.
                    setIsLoading(false);
                    if (res.data.code === 200) {
                        setUser({ username: res.data.username, email: res.data.email, login: true, token:token })
                    } else if (res.data.code === 403) {
                        // Modify token is not allowed
                        alert('token modified, please login...');
                        localStorage.clear();
                        window.location.href = '/';
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setIsLoading(false);
        }


    }, []);

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;

// Create a hook to use the APIContext

export function useAPI() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}