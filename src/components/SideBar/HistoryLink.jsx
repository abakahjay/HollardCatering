import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HistoryLogo } from "../../assets/constants.jsx";

const HistoryLink = ({ authUser }) => {
    const user = authUser.user ? authUser.user : authUser;

    // Dynamic label based on role
    const labelText = user?.role === "worker" ? "My Orders" : "All Orders";

    return (
        <Tooltip
            hasArrow
            label={"History"}
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Link
                display={"flex"}
                to={"/history"}
                as={RouterLink}
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "whiteAlpha.400" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
            >
                <HistoryLogo />
                <Box display={{ base: "none", md: "block" }}>{labelText}</Box>
            </Link>
        </Tooltip>
    );
};

export default HistoryLink;
