// import React, { useEffect } from "react";
// import {
//   Box,
//   Heading,
//   VStack,
//   Text,
//   IconButton,
//   HStack,
//   Spacer,
//   Spinner
// } from "@chakra-ui/react";
// import { DeleteIcon } from "@chakra-ui/icons";
// import { useNavigate } from "react-router-dom";
// import useAiChatActions from "../../hooks/useAiChatActions";
// import useAiChatStore from "../../store/useAiChatStore";
// import useShowToast from "../../hooks/useShowToast";

// const MessagesPage = ({ authUser }) => {
//   const user=authUser.user?authUser.user:authUser
//   const userId = user._id;

//   const { fetchUserChats, removeUserChat, isLoading } = useAiChatActions();
//   const { userChats } = useAiChatStore();
//   const navigate = useNavigate();
//   const showToast = useShowToast();

//   useEffect(() => {
//     if (userId) {
//       fetchUserChats(userId);
//     }
//   }, [userId]);

//   const handleDelete = async (chatId) => {
//     try {
//       // console.log(chatId)
//       await removeUserChat(userId,chatId);
//       showToast("Deleted", "Chat has been removed", "success");
//     } catch (err) {
//       showToast("Error", "Failed to delete chat", "error");
//     }
//   };

//   const handleOpenChat = (chatId) => {
//     navigate(`/chat/${chatId}`);
//   };

//   return (
//     <Box p={{ base: 2, md: 4 }} bg="#000" minH="100vh" color="white">
//       <Heading size="lg" mb={4} textAlign="center">
//         My Orders
//       </Heading>

//       <Box
//         maxH="80vh"
//         overflowY="auto"
//         border="1px solid #333"
//         borderRadius="md"
//         p={2}
//       >
//         {isLoading ? (
//           <Spinner color="white" />
//         ) : userChats.length === 0 ? (
//           <Text color="gray.400" textAlign="center">
//             No chats yet.
//           </Text>
//         ) : (
//           <VStack spacing={1} align="stretch">
//           {[...userChats].reverse().map((conv) => (
//               <Box
//                 key={conv._id}
//                 px={3}
//                 py={1}
//                 borderWidth="1px"
//                 borderColor="gray.700"
//                 borderRadius="md"
//                 bg="gray.900"
//                 _hover={{ bg: "gray.800", cursor: "pointer" }}
//                 onClick={() => handleOpenChat(conv.chatId)}
//               >
//                 <HStack>
//                   <Text fontWeight="bold" noOfLines={1} fontSize="sm">
//                     {conv.title || conv.latestMessage?.text?.slice(0, 25) || "Untitled Chat"}
//                   </Text>
//                   <Spacer />
//                   <IconButton
//                     icon={<DeleteIcon />}
//                     aria-label="Delete conversation"
//                     colorScheme="red"
//                     size="xs"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(conv.chatId);

//                     }}
//                   />
//                 </HStack>
//                 <Text fontSize="xs" color="gray.400" textAlign="right" mt="1px">
//                   {new Date(conv.createdAt).toLocaleString()}
//                 </Text>
//               </Box>
//             ))}
//           </VStack>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default MessagesPage;


import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  IconButton,
  HStack,
  Spacer,
  Spinner,
  Select,
  Badge,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useShowToast from "../../hooks/useShowToast";
import useFoodActions from "../../hooks/useFoodActions";

const MessagesPage = ({ authUser }) => {
  const user = authUser.user ? authUser.user : authUser;
  const userId = user._id;

  const {
    fetchUserOrders,
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder,
    fetchTotalSpent,
    isLoading,
  } = useFoodActions();

  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const showToast = useShowToast();

  const isAdmin = user.role === "admin";
  const isCaterer = user.role === "caterer";
  const isWorker = user.role === "worker";

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (isWorker) {
          const { orders: userOrders, totalSpent: spent } =
            await fetchUserOrders(userId);
          setOrders(userOrders);
          setTotalSpent(spent);
          // console.log(userOrders)
        } else {
          const allOrders = await fetchAllOrders();
          setOrders(allOrders);
          // console.log(allOrders)

          if (isAdmin) {
            const total = await fetchTotalSpent();
            setTotalSpent(total);
          }
        }
      } catch (err) {
        showToast("Error", "Failed to load orders", "error");
      }
    };

    loadOrders();
  }, [userId, isAdmin, isWorker]);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    const success = await deleteOrder(orderId);
    if (success) {
      setOrders((prev) => {
        const updatedOrders = prev.filter((o) => o._id !== orderId);

        // Recalculate totalSpent
        const newTotal = updatedOrders.reduce(
          (sum, o) => sum + (o.totalPrice || 0),
          0
        );
        setTotalSpent(newTotal);

        return updatedOrders;
      });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };
  const statusColors = {
    pending: "yellow",
    preparing: "blue",
    completed: "green",
  };

  return (
    <Box p={{ base: 2, md: 4 }} bgGradient="linear(to-br, #4B226F, #2D0A45)" minH="100vh" color="white">
      <HStack mb={4}>
        <Heading size="lg" flex="1">
          {isAdmin
            ? "All Orders (Admin)"
            : isCaterer
              ? "All Orders (Caterer)"
              : "My Orders"}
        </Heading>

        {(isAdmin || isWorker) && (
          <Text fontWeight="bold" color="green.300">
            Total Spent: GH₵ {(totalSpent ?? 0).toFixed(2)}
          </Text>
        )}
      </HStack>

      <Box
        maxH="80vh"
        overflowY="auto"
        border="1px solid #333"
        borderRadius="md"
        p={2}
      >
        {isLoading ? (
          <Spinner color="white" />
        ) : orders.length === 0 ? (
          <Text color="gray.400" textAlign="center">
            No orders found.
          </Text>
        ) : (
          <VStack spacing={2} align="stretch">
            {[...orders].reverse().map((order) => (
              <Box
                key={order._id}
                px={3}
                py={2}
                borderWidth="1px"
                borderColor="gray.700"
                borderRadius="md"
                bg="gray.900"
                _hover={{ bg: "gray.800" }}
              >
                {/* Meal + Quantity */}
                <HStack>
                  <Text fontWeight="bold">
                    {order.mealId?.name || order.mealName} × {order.quantity}
                  </Text>
                  <Spacer />
                  <Badge
                    colorScheme={
                      order.status === "pending"
                        ? "yellow"
                        : order.status === "preparing"
                          ? "blue"
                          : "green"
                    }
                  >
                    {order.status}
                  </Badge>
                </HStack>

                {/* Show user details (Admin & Caterer only) */}
                {(isAdmin || isCaterer) && order.userId && (
                  <Text fontSize="sm" color="cyan.300" mt={1}>
                    Ordered by:{" "}
                    {order.userId.firstName} {order.userId.lastName} (
                    {order.userId.email})
                  </Text>
                )}

                {/* Caterer should NOT see prices */}
                {!isCaterer && (
                  <Text fontSize="sm" color="gray.300">
                    GH₵ {order.totalPrice?.toFixed(2) ?? "0.00"}
                  </Text>
                )}

                {/* Order date */}
                <Text fontSize="xs" color="gray.400" mt={1}>
                  {order.date
                    ? new Date(order.date).toLocaleString()
                    : "Unknown date"}
                </Text>

                {/* Status Edit (Admin & Caterer) */}
                {(isAdmin || isCaterer) && (


                  <Select
                    mt={2}
                    size="sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    bg={`${statusColors[order.status]}.500`}
                    color="white"
                    _hover={{ bg: `${statusColors[order.status]}.600` }}
                    _focus={{ bg: `${statusColors[order.status]}.600` }}
                  >
                    <option style={{ background: "#ECC94B", color: "black" }} value="pending">
                      Pending
                    </option>
                    <option style={{ background: "#4299E1", color: "white" }} value="preparing">
                      Preparing
                    </option>
                    <option style={{ background: "#48BB78", color: "white" }} value="completed">
                      Completed
                    </option>
                  </Select>

                )}

                {/* Delete Button (Admin Only) */}
                {isAdmin && (
                  <IconButton
                    mt={2}
                    icon={<DeleteIcon />}
                    aria-label="Delete order"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(order._id)}
                  />
                )}
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default MessagesPage;
