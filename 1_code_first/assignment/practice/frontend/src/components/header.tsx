import { Link } from "react-router-dom";

const Logo = () => (
    <div id="app-logo">
Logo    </div>
);
const TitleAndSubmission = () => (
    <div id="title-container">
        <h1>Domain-Driven Designers</h1>
        <h3>Where awesome domain driven designers are made</h3>
    </div>
);

const HeaderActionButton = ({ user }: { user: any }) => (
    <div id="header-action-button">
        {user ? (
            <div>
                <div>{user.username}</div>
                <u>
                    <div>logout</div>
                </u>
            </div>
        ) : (
            <Link to="/signup">Signup</Link>
        )}
    </div>
);

const shouldShowActionButton = (pathName: string) => {
    return pathName !== "/signup";
};

export const Header = () => {
    return (
        <header id="header" className="flex align-center">
            <Logo />
            <TitleAndSubmission />
            {shouldShowActionButton(location.pathname) ? (
                <HeaderActionButton user={null} />
            ) : (
                ""
            )}
        </header>
    );
};