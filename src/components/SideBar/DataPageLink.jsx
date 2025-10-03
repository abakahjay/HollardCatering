import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { DatabaseLogo } from "../../assets/constants"; // we'll define this SVG/icon

const DataPageLink = ({ authUser }) => {
  const user = authUser.user ? authUser.user : authUser;
  const isAdmin = user.role === "admin";
  const isCaterer = user.role === "caterer";

  if (!isAdmin && !isCaterer) return null; // restrict access

  return (
    <Tooltip
      hasArrow
      label={isAdmin ? "Admin Data" : "Caterer Data"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/data"} // 🔹 same route, but page content will depend on role
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <DatabaseLogo size={25} />
        <Box display={{ base: "none", md: "block" }}>
          Data
        </Box>
      </Link>
    </Tooltip>
  );
};

export default DataPageLink;
