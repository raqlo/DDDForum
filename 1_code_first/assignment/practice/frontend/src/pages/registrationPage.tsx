import {RegistrationForm} from "../components/registratonForm";
import {useUser} from "../contexts/userContext";
import {useState} from "react";
import {z} from "zod";

function RegistrationPage() {
    const { setUser } = useUser();
    const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
        // Logic
        console.log(input);
        // Validate the form
        const validationResult = validateForm(input)
        // If the form is invalid
        if(validationResult.errorMessage) {
            // Show an error toast (for invalid input)
            console.log(validationResult.errorMessage);
            return
        }

        // If the form is valid, start isLoading
        // Make the API call
    }
    return <div className="flex justify-center items-center h-screen">
        <h1>Create an account</h1>
        <RegistrationForm
            onSubmit={(input: RegistrationInput) =>
                handleSubmitRegistrationForm(input)
            }
        />
    </div>
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