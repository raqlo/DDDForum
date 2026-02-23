import {Box, Button, Flex, TextField} from "@radix-ui/themes"
import {type SubmitEvent, useState} from "react";
import type {RegistrationInput} from "../pages/registrationPage";


interface RegistrationFormProps {
    onSubmit: (formDetails: RegistrationInput) => void;
}

export const RegistrationForm = (props: RegistrationFormProps) => {
    const [email, setEmail] = useState('email');
    const [username, setUsername] = useState('username');
    const [firstName, setFirstName] = useState('firstName');
    const [lastName, setLastName] = useState('lastName');
    const [password, setPassword] = useState('password');

    const handleSubmit = (ev: SubmitEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.onSubmit({
            email, username, firstName, lastName, password
        })
    }

    return (
        <Box maxWidth="400px" width="100%">
            <form onSubmit={(ev) => handleSubmit(ev)}>
                <Flex direction="column" gap="4">
                    <TextField.Root
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField.Root
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField.Root
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <TextField.Root
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <TextField.Root
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit">Register</Button>
                </Flex>
            </form>
        </Box>
    )
}




