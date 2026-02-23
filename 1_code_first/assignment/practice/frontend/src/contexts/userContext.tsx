import React, {createContext, type ReactNode, useContext, useState} from "react";

export interface UserData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

const UserContext = createContext<{
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}>({
    user: null,
    setUser: () => null,
});

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider: React.FC<{children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);

    return (<UserContext value={{ user, setUser }}>
        {children}
    </UserContext>)
};