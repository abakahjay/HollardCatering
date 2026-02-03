import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AddMealLogo } from "../../assets/constants"; // use your svg from constants

const AddMealLink = ({ authUser }) => {
  const user = authUser.user ? authUser.user : authUser;
  const isCaterer = user.role === "caterer";

  if (!isCaterer) return null; // restrict to caterers only

  return (
    <Tooltip
      hasArrow
      label={"Add Meal"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/add-meal"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <AddMealLogo size={25} />
        <Box display={{ base: "none", md: "block" }}>
          Add Meal
        </Box>
      </Link>
    </Tooltip>
  );
};

export default AddMealLink;
