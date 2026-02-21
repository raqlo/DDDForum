import {Header} from "./header";

export const Layout = ({ children }: any) => (
    <>
        <Header/>
        <main>
            {children}
        </main>
    </>
)