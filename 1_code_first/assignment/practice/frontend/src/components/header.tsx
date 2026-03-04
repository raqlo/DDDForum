import { Link } from "react-router-dom";
import type {UserData} from "../contexts/userContext";

const Logo = () => (
    <div className={"flex items-center gap-3"}>
        <Link to={"/"}>
            <span className="text-4xl font-bold">DDD</span>
        </Link>
        <p className="text-sm text-gray-500">Where awesome domain driven designers are made</p>
    </div>
);

const HeaderActionButton = ({ user }: { user: UserData }) => {
    return <div className="flex gap-3 items-center">
        {user ? (
            <div className="flex gap-2 items-center">
                <span>{user.username}</span>
                <button className="btn btn-ghost btn-sm">
                    Logout
                </button>
            </div>
        ) : (
            <>
                <Link to="/login">
                    <button className="btn btn-outline btn-sm">
                        Login
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="btn btn-primary btn-sm">
                        Signup
                    </button>
                </Link>
            </>
        )}
    </div>
};

interface HeaderProps {
    showAuth?: boolean;
    user?: any;
}

export const Header = ({ showAuth = true, user = null }: HeaderProps) => {
    return (
        <header id="header" className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Logo />
            </div>
            {showAuth && (
                <div className="flex-none">
                    <HeaderActionButton user={user} />
                </div>
            )}
        </header>
    );
};