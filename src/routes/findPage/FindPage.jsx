/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Button,
  VStack,
  Heading,
  Center,
  Spinner,
} from "@chakra-ui/react";
import backgroundImg from "/backroundimg.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFoodActions from "../../hooks/useFoodActions";

export default function FindPage({ authUser }) {
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [query, setQuery] = useState("");
  const { fetchMeals, createOrder, isLoading } = useFoodActions();
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingFoodId, setLoadingFoodId] = useState(null);


  const user = authUser?.user ? authUser.user : authUser;
  const userId = user?._id;
  const navigate = useNavigate();

  function similarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;

    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    const editDistance = (s1, s2) => {
      const costs = [];
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) costs[j] = j;
          else {
            if (j > 0) {
              let newValue = costs[j - 1];
              if (s1[i - 1] !== s2[j - 1]) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0) costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    };

    return (longerLength - editDistance(longer, shorter)) / longerLength;
  }


  useEffect(() => {
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const foods = await fetchMeals();
        if (!foods) return;

        // ✅ Get search query (from localStorage or URL)
        const storedQuery = localStorage.getItem("dashboardMessage");
        const urlParams = new URLSearchParams(window.location.search);
        const urlQuery = urlParams.get("search");

        const searchTerm = (storedQuery || urlQuery || "").toLowerCase();
        setQuery(searchTerm);

        if (searchTerm) {
          const threshold = 0.5; // 50% match
          setFilteredFoods(
            foods.filter(food =>
              food.keywords?.some(keyword => similarity(keyword, searchTerm) >= threshold)
            )
          );

        } else {
          setFilteredFoods(foods); // ✅ Show all meals if no query
        }

        // ✅ Clear search term so next visit shows all meals
        localStorage.removeItem("dashboardMessage");
      } catch (err) {
        console.error("Error fetching foods:", err);
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchFoods();
  }, []);

  const handleOrder = async (food) => {
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }

    // ✅ Each food is 40 cedis (fixed)
    const pricePerMeal = 40;
    const quantity = 1;

    // ✅ Match schema exactly
    const orderData = {
      userId,
      mealName: food.name,
      mealId: food._id,
      quantity,
      pricePerMeal,
      totalPrice: pricePerMeal * quantity,
      orderedByRole: user?.role || "worker",
    };

    try {
      setLoadingFoodId(food._id); // ✅ mark this food as loading
      const newOrder = await createOrder(orderData);
      if (newOrder) {
        navigate("/history");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoadingFoodId(null); // ✅ reset after done
    }
  };

  return (
    <Box
      bgImage={`url(${backgroundImg})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      minH="100vh"
      p={{ base: 4, md: 10 }}
      position="relative"
    >
      <Center mb={10}>
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "4xl" }}
          color="yellow.400"
          fontWeight="bold"
          textAlign="center"
          textTransform="uppercase"
          letterSpacing="wide"
          bg="rgba(0,0,0,0.6)"
          p={3}
          borderRadius="md"
        >
          {query ? `Results for "${query}"` : "Find Your Meal"}
        </Heading>
      </Center>

      {loadingFoods ? (
        <Center>
          <Spinner size="xl" color="yellow.400" />
        </Center>
      ) : filteredFoods.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredFoods.map((food) => (
            <Box
              key={food._id}
              bg="rgba(30, 30, 30, 0.95)"
              borderRadius="2xl"
              p={5}
              boxShadow="lg"
              transition="all 0.2s ease"
              _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            >
              <Image
                src={food.image}
                alt={food.name}
                borderRadius="lg"
                h="180px"
                w="100%"
                objectFit="cover"
                mb={4}
              />
              <VStack align="start" spacing={3}>
                <Text fontSize="xl" fontWeight="bold" color="yellow.400">
                  {food.name}
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="red.400">
                  ₵40.00
                </Text>
                <Button
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: "red.600" }}
                  isLoading={loadingFoodId === food._id} // ✅ only show for this food
                  onClick={() => handleOrder(food)}
                >
                  Order Now
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center>
          <Text
            fontSize="xl"
            color="white"
            bg="rgba(0,0,0,0.6)"
            p={4}
            borderRadius="md"
          >
            Sorry, no meals found for "{query}".
          </Text>
        </Center>
      )}
    </Box>
  );
}
