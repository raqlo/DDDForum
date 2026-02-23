import {RegistrationForm} from "../components/registratonForm";
import {useUser} from "../contexts/userContext";
import {useState} from "react";
import {z} from "zod";
import { Header } from "../components/header";
import {toast, ToastContainer} from "react-toastify";
import {LoadingSpinner} from "../components/loadingSpinner";

function RegistrationPage() {
    const { setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
        // Validate the form
        const validationResult = validateForm(input)
        // If the form is invalid
        if(validationResult.errorMessage) {
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
            return
        }
        setIsLoading(true);

        // If the form is valid, start isLoading

        // Make the API call
    }
    return (
        <div>
            <Header showAuth={false} />
            <div className="flex flex-col items-center justify-center gap-4 p-8">
                <h2 className="text-3xl font-bold">Create an account</h2>
                <RegistrationForm
                    onSubmit={(input: RegistrationInput) =>
                        handleSubmitRegistrationForm(input)
                    }
                />
            </div>
            <ToastContainer />
            {isLoading && <LoadingSpinner size={"sm"} />}
        </div>
    )
}

const registrationInput = z.object({
    email: z.email(),
    username: z.string().min(3),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(8)
})

export type RegistrationInput = z.infer<typeof registrationInput>


type ValidationResult = {
    success: boolean;
    errorMessage?: string;
}

function validateForm (input: RegistrationInput): ValidationResult {
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

export {RegistrationPage}