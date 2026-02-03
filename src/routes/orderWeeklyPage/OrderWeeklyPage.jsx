import {
    Box,
    Heading,
    Text,
    VStack,
    Button,
    Spinner,
    Select,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useFoodActions from "../../hooks/useFoodActions";

export default function OrderWeeklyPage({ authUser }) {
    const {
        isLoading,
        fetchMeals,
        fetchUserOrders,
        createOrder,
    } = useFoodActions();
    const [meals, setMeals] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState("");
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            const mealList = await fetchMeals();
            setMeals(mealList);

            const userOrders = await fetchUserOrders(authUser?._id);
            setOrders(userOrders.orders || []);
        };
        loadData();
    }, [authUser]);

    const handleOrder = async () => {
        if (!selectedMeal) {
            toast({ title: "Please select a meal", status: "warning" });
            return;
        }
        const order = await createOrder({
            userId: authUser?._id,
            mealId: selectedMeal,
            status: "pending",
        });
        if (order) {
            toast({ title: "Order placed successfully", status: "success" });
            setOrders((prev) => [...prev, order]);
            setSelectedMeal("");
        }
    };

    return (
        <Box p={6}>
            <Heading size="lg" mb={4}>
                Weekly Orders
            </Heading>
            <Text color="gray.400" mb={6}>
                Workers can view the available meals for the week and place or update
                their orders here.
            </Text>

            {isLoading ? (
                <Spinner size="xl" />
            ) : (
                <VStack align="start" spacing={4}>
                    <Select
                        placeholder="Select meal to order"
                        value={selectedMeal}
                        onChange={(e) => setSelectedMeal(e.target.value)}
                    >
                        {meals.map((meal) => (
                            <option key={meal._id} value={meal._id}>
                                {meal.day} - {meal.name} (₵{meal.price})
                            </option>
                        ))}
                    </Select>
                    <Button
                        colorScheme="teal"
                        onClick={handleOrder}
                        isLoading={isLoading}
                    >
                        Place Order
                    </Button>

                    <Box mt={6} w="full">
                        <Heading size="md" mb={2}>
                            Your Orders
                        </Heading>
                        {orders.length === 0 ? (
                            <Text color="gray.400">No orders yet</Text>
                        ) : (
                            orders.map((order) => (
                                <Box
                                    key={order._id}
                                    p={3}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    mb={2}
                                >
                                    <Text>
                                        <b>Meal:</b> {order.mealId?.name || "N/A"} ({order.status})
                                    </Text>
                                    <Text fontSize="sm" color="gray.400">
                                        Date: {new Date(order.createdAt).toLocaleString()}
                                    </Text>
                                </Box>
                            ))
                        )}
                    </Box>
                </VStack>
            )}
        </Box>
    );
}
