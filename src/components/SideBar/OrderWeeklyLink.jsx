import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { OrderWeeklyLogo } from "../../assets/constants"; // use your svg from constants

const OrderWeeklyLink = ({ authUser }) => {
  const user = authUser.user ? authUser.user : authUser;
  const isWorker = user.role === "worker";
  const isAdmin = user.role === "admin";

  if (!isWorker && !isAdmin) return null; // restrict to worker/admin

  return (
    <Tooltip
      hasArrow
      label={"Order Weekly"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display={"flex"}
        to={"/order-weekly"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <OrderWeeklyLogo size={25} />
        <Box display={{ base: "none", md: "block" }}>
          Order Weekly
        </Box>
      </Link>
    </Tooltip>
  );
};

export default OrderWeeklyLink;
