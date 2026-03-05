import {RegistrationForm} from "../components/registratonForm";
import {useUser} from "../contexts/userContext";
import {useState} from "react";
import {z} from "zod";
import {toast, ToastContainer} from "react-toastify";
import {LoadingSpinner} from "../components/loadingSpinner";
import {userServices} from "../services/users";
import {useNavigate} from "react-router"
import {Layout} from "../components/layout";
import {isAxiosError} from "axios";

function RegistrationPage() {
    const {setUser} = useUser();
    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();


    const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
        // Validate the form
        const validationResult = validateForm(input)
        // If the form is invalid
        if (validationResult.errorMessage) {
            // Show an error toast (for invalid input)
            toast.error('There was an error with your registration. Please try again.', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setIsLoading(false);
            return
        }
        // If the form is valid, start isLoading
        setIsLoading(true);

        // Make the API call
        try {
            const res = await userServices.registerUser({user: input});
            setUser(res.data.data)

        } catch (error) {
            if (isAxiosError(error)) {
                debugger;
                toast.error(validationErrorMap(error.response?.data.error), {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            setIsLoading(false);
            return;
        }
        navigate("/")
    }
    return (
        <Layout showAuth={false}>
            <div className="flex flex-col items-center justify-center gap-4 p-8">
                <h2 className="text-3xl font-bold">Create an account</h2>
                <RegistrationForm
                    onSubmit={(input: RegistrationInput) =>
                        handleSubmitRegistrationForm(input)
                    }
                />
            </div>
            <ToastContainer/>
            {isLoading && <LoadingSpinner size={"sm"}/>}
        </Layout>
    )
}

const registrationInput = z.object({
    email: z.email(),
    username: z.string().min(3),
    name: z.string(),
    lastName: z.string(),
    password: z.string().min(8)
})

export type RegistrationInput = z.infer<typeof registrationInput>


type ValidationResult = {
    success: boolean;
    errorMessage?: string;
}

function validateForm(input: RegistrationInput): ValidationResult {
    const validationResult = registrationInput.safeParse(input)
    if (!validationResult.success) {
        return {
            success: false,
            errorMessage: validationResult.error.message
        }
    } else {
        return {success: true}
    }
}

const registrationErrors: Record<string, string> = {
    ValidationError: "Some fields are invalid. Please check the form for errors.",
    InvalidEmail: "Email is invalid",
    UsernameAlreadyTaken: "Username is already taken. Please choose another one.",
    EmailAlreadyInUse: "Email is already in use. Please login with your existing account."
}

function validationErrorMap(error: string): string {
    return registrationErrors[error] ?? "An unknown error occurred. Please try again later."
}

export {RegistrationPage}