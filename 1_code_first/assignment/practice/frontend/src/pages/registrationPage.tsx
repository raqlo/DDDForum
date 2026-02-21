import { TextField, Button, Flex, Box } from '@radix-ui/themes';

function RegistrationPage() {
    return <div className="flex justify-center items-center h-screen">
        <RegistrationForm></RegistrationForm>
    </div>
}


function RegistrationForm() {
    return (
        <Box maxWidth="400px" width="100%">
            <form>
                <Flex direction="column" gap="4">
                    <TextField.Root
                        type="email"
                        placeholder="Email"
                    />

                    <TextField.Root
                        type="text"
                        placeholder="First Name"
                    />

                    <TextField.Root
                        type="text"
                        placeholder="Last Name"
                    />

                    <TextField.Root
                        type="password"
                        placeholder="Password"
                    />

                    <Button type="submit">Register</Button>
                </Flex>
            </form>
        </Box>
    )
}

export {RegistrationPage}