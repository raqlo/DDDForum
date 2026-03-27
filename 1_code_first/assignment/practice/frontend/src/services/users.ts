import {apiHandler} from "./apiHandler";
import type {UserData} from "../contexts/userContext";
import type {RegistrationInput} from "../pages/registrationPage";

type RegisterUserInput = {
    user: RegistrationInput;
}


const userServices = {
    registerUser: (params: RegisterUserInput) => apiHandler<UserData, string>('/users/new', {method: 'POST', data: params.user}),
}

export { userServices}