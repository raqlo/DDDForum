import './App.css'
import "@radix-ui/themes/styles.css";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/mainPage";
import {RegistrationPage} from "./pages/registrationPage";

function App() {
    return (
        <BrowserRouter>
            <meta name="color-scheme" content="light only"></meta>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/signup" element={<RegistrationPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
