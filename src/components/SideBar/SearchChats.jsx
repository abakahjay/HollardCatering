import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import { useNavigate } from "react-router-dom";

const SearchChats = () => {
  const navigate = useNavigate();

  return (
    <Tooltip
      hasArrow
      label="Search Meal"
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Flex
        alignItems="center"
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
        onClick={() => navigate("/findmeal")} // ✅ FIXED HERE
        cursor="pointer"
      >
        <SearchLogo />
        <Box display={{ base: "none", md: "block" }}>Find Meal</Box>
      </Flex>
    </Tooltip>
  );
};

export default SearchChats;
