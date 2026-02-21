import './App.css'
import "@radix-ui/themes/styles.css";
import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/mainPage";
import {RegistrationPage} from "./pages/registrationPage";
import {UserProvider} from "./contexts/userContext";

function App() {

    return (
        <UserProvider>
            <BrowserRouter>
                <meta name="color-scheme" content="light only"></meta>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/signup" element={<RegistrationPage/>}/>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App
