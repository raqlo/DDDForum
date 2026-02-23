import { Link } from "react-router-dom";
import { Flex, Box, Button, Text } from "@radix-ui/themes";

const Logo = () => (
    <Box>
        <Text size="8" weight="bold">DDD</Text>
        <Text size="2" color="gray">Where awesome domain driven designers are made</Text>
    </Box>
);

const HeaderActionButton = ({ user }: { user: any }) => (
    <Flex gap="3" align="center">
        {user ? (
            <Flex gap="2" align="center">
                <Text>{user.username}</Text>
                <Button variant="ghost" size="2">
                    Logout
                </Button>
            </Flex>
        ) : (
            <>
                <Link to="/login">
                    <Button variant="soft" size="2">
                        Login
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button size="2">
                        Signup
                    </Button>
                </Link>
            </>
        )}
    </Flex>
);

export const Header = () => {
    return (
        <Box asChild>
            <header id="header">
                <Flex justify="between" align="center" p="4">
                    <Logo />
                    <HeaderActionButton user={null} />
                </Flex>
            </header>
        </Box>
    );
};