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

  const getFeedbackForOrder = (orderId) => {
    return feedbacks.find(f => f.orderId && f.orderId._id === orderId);
  };


  const handleSaveFeedback = async (orderId) => {
  const fbData = editing[orderId];
  if (!fbData) return;

  let savedFeedback;
  const existing = getFeedbackForOrder(orderId);

  if (existing) {
    savedFeedback = await updateFeedback(existing._id, fbData);
  } else {
    savedFeedback = await createFeedback({
      userId,
      orderId,
      eaten: fbData.eaten,
      delivered: fbData.delivered,
      comment: fbData.comment || "",
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
      const hasFeedback = prev.some((f) => f.orderId && f.orderId._id === orderId);
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
    <Box minH="100vh" p={5} bg="#111" color="white">
      <Center mb={10}>
        <Heading as="h1" size="2xl" color="yellow.400">
          {role === "admin" ? "All Orders & Feedbacks" : "My Orders & Feedbacks"}
        </Heading>
      </Center>

      {isLoading ? (
        <Center>
          <Spinner size="xl" color="yellow.400" />
        </Center>
      ) : orders.length === 0 ? (
        <Center>
          <Text fontSize="xl">No orders found.</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {orders
            .slice()
            .reverse()
            .map((order) => {
              const fb = getFeedbackForOrder(order._id) || null;
              const isEditing = Boolean(editing[order._id]);


              return (
                <Box key={order._id} p={5} borderRadius="md" bg="gray.800">
                  <VStack align="start" spacing={3}>
                    <HStack w="100%" justify="space-between">
                      <Text fontWeight="bold" color="yellow.400">
                        {order.mealId?.name || order.mealName} × {order.quantity}
                      </Text>
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

                    {role === "admin" && order.userId && (
                      <Text fontSize="sm" color="cyan.300">
                        Ordered by: {order.userId.firstName} {order.userId.lastName} (
                        {order.userId.email})
                      </Text>
                    )}

                    <Text fontSize="xs" color="gray.400">
                      {order.date
                        ? new Date(order.date).toLocaleString()
                        : "Unknown date"}
                    </Text>

                    {/* Feedback Section */}
                    <Box mt={2} p={3} bg="gray.900" borderRadius="md" w="100%">
                      {(role === "worker" || role === "admin") && (
                        <>
                          {isEditing ? (
                            <>
                              <Textarea
                                placeholder="Eaten?"
                                size="sm"
                                mb={2}
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
                                mb={2}
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
                                colorScheme="green"
                                size="sm"
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
                              {role === "admin" && fb.userId && (
                                <Text fontSize="sm" color="gray.400">
  By: {fb.userId.firstName || ""} {fb.userId.lastName || ""} ({fb.userId.email})
</Text>

                              )}
                              <Button
                                size="sm"
                                onClick={() =>
                                  setEditing((prev) => ({ ...prev, [order._id]: { ...fb } }))
                                }
                              >
                                Edit Feedback
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                setEditing((prev) => ({ ...prev, [order._id]: {} }))
                              }
                            >
                              Add Feedback
                            </Button>
                          )}
                        </>
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
