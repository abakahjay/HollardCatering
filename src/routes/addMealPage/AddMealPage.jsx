import {
    Box,
    Heading,
    Text,
    VStack,
    Input,
    Button,
    Select,
    Spinner,
    HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useFoodActions from "../../hooks/useFoodActions";

export default function AddMealPage({ authUser }) {
    const { isLoading, fetchMeals, createMeal, deleteMeal } = useFoodActions();
    const [meals, setMeals] = useState([]);
    const [day, setDay] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        const loadMeals = async () => {
            const data = await fetchMeals();
            setMeals(data);
        };
        loadMeals();
    }, []);

    const handleAddMeal = async () => {
        if (!day || !name || !price) return alert("All fields required");
        const newMeal = await createMeal({ day, name, price });
        if (newMeal) {
            setMeals((prev) => [...prev, newMeal]);
            setDay("");
            setName("");
            setPrice("");
        }
    };

    const handleDeleteMeal = async (id) => {
        const ok = await deleteMeal(id);
        if (ok) setMeals((prev) => prev.filter((m) => m._id !== id));
    };

    return (
        <Box p={6}>
            <Heading size="lg" mb={4}>
                Add Meals for the Week
            </Heading>
            <Text color="gray.400" mb={6}>
                This page allows the caterer to set meals for each day of the week.
            </Text>

            <VStack align="start" spacing={4}>
                <Select
                    placeholder="Select Day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </Select>
                <Input
                    placeholder="Meal Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    placeholder="Price (₵)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Button
                    colorScheme="green"
                    onClick={handleAddMeal}
                    isLoading={isLoading}
                >
                    Add Meal
                </Button>
            </VStack>

            <Box mt={8} w="full">
                <Heading size="md" mb={3}>
                    Weekly Meals
                </Heading>
                {isLoading ? (
                    <Spinner />
                ) : meals.length === 0 ? (
                    <Text color="gray.400">No meals added yet</Text>
                ) : (
                    meals.map((meal) => (
                        <HStack
                            key={meal._id}
                            w="full"
                            justify="space-between"
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                            mb={2}
                        >
                            <Box>
                                <Text>
                                    <b>{meal.day}</b>: {meal.name} (₵{meal.price})
                                </Text>
                            </Box>
                            <Button
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDeleteMeal(meal._id)}
                            >
                                Delete
                            </Button>
                        </HStack>
                    ))
                )}
            </Box>
        </Box>
    );
}
