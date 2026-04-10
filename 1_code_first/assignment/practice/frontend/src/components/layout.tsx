import {Header} from "./header";
import {useUser} from "../contexts/userContext";

export const Layout = ({ children, showAuth }: {children: any, showAuth: boolean}) => {
    const {user} = useUser();
    return <>
        <Header user={user} showAuth={showAuth}/>
        <main>
            {children}
        </main>
    </>
}