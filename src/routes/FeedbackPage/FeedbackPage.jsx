/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Center,
  Spinner,
  VStack,
  HStack,
  Badge,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useFoodActions from "../../hooks/useFoodActions";

export default function FeedbackPage({ authUser }) {
  const {
    fetchUserOrders,
    fetchAllOrders,
    fetchFeedbacks,
    createFeedback,
    updateFeedback,
    isLoading,
  } = useFoodActions();

  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editing, setEditing] = useState({});
  const user = authUser.user ? authUser.user : authUser;
  const userId = user._id;
  const role = user?.role;

  useEffect(() => {
    const loadData = async () => {
      let allOrders = [];
      let allFeedbacks = [];

      if (role === "worker") {
        const { orders: userOrders } = await fetchUserOrders(userId);
        allOrders = userOrders;
      } else {
        allOrders = await fetchAllOrders();
      }

      allFeedbacks = await fetchFeedbacks();
      setOrders(allOrders);
      setFeedbacks(allFeedbacks);
    };

    loadData();
  }, [userId, role]);

  const getFeedbackForOrder = (orderId) =>
    feedbacks.find((f) => f.orderId && f.orderId._id === orderId);

  const handleSaveFeedback = async (orderId) => {
  const fbData = editing[orderId];
  if (!fbData) return;

  const existing = getFeedbackForOrder(orderId);

  // merge old values with new edits
  const finalData = {
    eaten: fbData.eaten !== undefined ? fbData.eaten : existing?.eaten || "",
    delivered:
      fbData.delivered !== undefined ? fbData.delivered : existing?.delivered || "",
    comment: fbData.comment !== undefined ? fbData.comment : existing?.comment || "",
  };

  let savedFeedback;
  if (existing) {
    savedFeedback = await updateFeedback(existing._id, finalData);
  } else {
    savedFeedback = await createFeedback({
      userId,
      orderId,
      ...finalData,
    });
  }

  if (savedFeedback) {
    const updatedFeedback = {
  ...savedFeedback,
  orderId: { _id: orderId, ...savedFeedback.orderId },
  userId: savedFeedback.userId || {
    _id: user._id,
    email: user.email,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  },
};


    setFeedbacks((prev) => {
      const hasFeedback = prev.some(
        (f) => f.orderId && f.orderId._id === orderId
      );
      return hasFeedback
        ? prev.map((f) =>
            f.orderId && f.orderId._id === orderId ? updatedFeedback : f
          )
        : [...prev, updatedFeedback];
    });

    setEditing((prev) => {
      const newEditing = { ...prev };
      delete newEditing[orderId];
      return newEditing;
    });
  }
};


  return (
    <Box
      minH="100vh"
      p={8}
      bgGradient="linear(to-br, #4B226F, #2D0A45)"
      color="white"
    >
      <Center mb={12}>
        <Heading as="h1" size="2xl" color="#F15A22" fontWeight="extrabold">
          {role === "admin"
            ? "All Orders & Feedbacks"
            : "My Orders & Feedbacks"}
        </Heading>
      </Center>

      {isLoading ? (
        <Center>
          <Spinner size="xl" color="#F15A22" thickness="4px" />
        </Center>
      ) : orders.length === 0 ? (
        <Center>
          <Text fontSize="lg" color="gray.300">
            No orders found.
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {orders
            .slice()
            .reverse()
            .map((order) => {
              const fb = getFeedbackForOrder(order._id) || null;
              const isEditing = Boolean(editing[order._id]);

              return (
                <Box
                  key={order._id}
                  p={6}
                  borderRadius="2xl"
                  bg="rgba(255, 255, 255, 0.05)"
                  boxShadow="xl"
                  backdropFilter="blur(10px)"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-4px)" }}
                >
                  <VStack align="start" spacing={3}>
                    <HStack w="100%" justify="space-between">
                      <Text fontWeight="bold" color="#F15A22">
                        {order.mealId?.name || order.mealName} × {order.quantity}
                      </Text>
                      <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                        fontSize="0.8rem"
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

                    {role === "admin" && order.userId && (
                      <Text fontSize="sm" color="cyan.300">
                        Ordered by: {order.userId.firstName}{" "}
                        {order.userId.lastName} ({order.userId.email})
                      </Text>
                    )}

                    <Text fontSize="xs" color="gray.400">
                      {order.date
                        ? new Date(order.date).toLocaleString()
                        : "Unknown date"}
                    </Text>

                    {/* Feedback Section */}
<Box
  mt={3}
  p={4}
  bg="rgba(255,255,255,0.08)"
  borderRadius="lg"
  w="100%"
>
  {(role === "worker" || role === "admin") ? (
    <>
      {isEditing ? (
        <>
          <Textarea
            placeholder="Eaten?"
            size="sm"
            mb={2}
            borderRadius="md"
            bg="whiteAlpha.100"
            border="1px solid transparent"
            _focus={{
              borderColor: "#F15A22",
              boxShadow: "0 0 0 1px #F15A22",
            }}
            value={editing[order._id]?.eaten || fb?.eaten || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...prev,
                [order._id]: {
                  ...prev[order._id],
                  eaten: e.target.value,
                },
              }))
            }
          />
          <Textarea
            placeholder="Delivered?"
            size="sm"
            mb={2}
            borderRadius="md"
            bg="whiteAlpha.100"
            border="1px solid transparent"
            _focus={{
              borderColor: "#F15A22",
              boxShadow: "0 0 0 1px #F15A22",
            }}
            value={editing[order._id]?.delivered || fb?.delivered || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...prev,
                [order._id]: {
                  ...prev[order._id],
                  delivered: e.target.value,
                },
              }))
            }
          />
          <Textarea
            placeholder="Comment (optional)"
            size="sm"
            mb={3}
            borderRadius="md"
            bg="whiteAlpha.100"
            border="1px solid transparent"
            _focus={{
              borderColor: "#F15A22",
              boxShadow: "0 0 0 1px #F15A22",
            }}
            value={editing[order._id]?.comment || fb?.comment || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...prev,
                [order._id]: {
                  ...prev[order._id],
                  comment: e.target.value,
                },
              }))
            }
          />
          <Button
            colorScheme="orange"
            size="sm"
            borderRadius="full"
            fontWeight="bold"
            onClick={() => handleSaveFeedback(order._id)}
          >
            Save Feedback
          </Button>
        </>
      ) : fb ? (
        <>
          <Text>Eaten: {fb.eaten}</Text>
          <Text>Delivered: {fb.delivered}</Text>
          {fb.comment && <Text>Comment: {fb.comment}</Text>}
          <Button
            size="sm"
            mt={2}
            colorScheme="purple"
            borderRadius="full"
            onClick={() =>
              setEditing((prev) => ({
                ...prev,
                [order._id]: { ...fb },
              }))
            }
          >
            Edit Feedback
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          colorScheme="purple"
          borderRadius="full"
          onClick={() =>
            setEditing((prev) => ({
              ...prev,
              [order._id]: {},
            }))
          }
        >
          Add Feedback
        </Button>
      )}
    </>
  ) : (
    fb && (
      <>
        <Text>Eaten: {fb.eaten}</Text>
        <Text>Delivered: {fb.delivered}</Text>
        {fb.comment && <Text>Comment: {fb.comment}</Text>}
        {fb.userId && (
          <Text fontSize="sm" color="gray.400">
            By: {fb.userId.firstName || ""} {fb.userId.lastName || ""} (
            {fb.userId.email})
          </Text>
        )}
      </>
    )
  )}
</Box>

                  </VStack>
                </Box>
              );
            })}
        </SimpleGrid>
      )}
    </Box>
  );
}
