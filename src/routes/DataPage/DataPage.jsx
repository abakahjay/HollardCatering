import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  Spinner,
  Button,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import useFoodActions from "../../hooks/useFoodActions";
import { downloadCSV } from "../../utils/downloadCSV";
import { ProfileUrl } from "../../utils/imageUrl";

export default function DataPage({ authUser }) {
  const user = authUser.user ? authUser.user : authUser;
  const { fetchAdminAnalytics, fetchCatererAnalytics } = useFoodActions();

  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [catererData, setCatererData] = useState(null);

  const isAdmin = user.role === "admin";
  const isCaterer = user.role === "caterer";

  useEffect(() => {
    const loadData = async () => {
      if (isAdmin) {
        const data = await fetchAdminAnalytics();
        setAdminData(data || {});
      } else if (isCaterer) {
        const data = await fetchCatererAnalytics();
        setCatererData(data || {});
      }
      setLoading(false);
    };
    loadData();
  }, [isAdmin, isCaterer]);

  if (loading) return <Spinner size="xl" mt={10} />;

  // Helper: group items by date (safely)
  const groupByDate = (items, dateField) => {
    return items.reduce((acc, item) => {
      // fallback fields: item[dateField], item.createdAt, item.date
      const raw = item[dateField] ?? item.createdAt ?? item.date ?? new Date();
      const date = new Date(raw).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  // Format the heading: Today, Yesterday, or date string
  const formatHeading = (dateStr) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return dateStr;
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        {isAdmin ? "Admin Dashboard" : "Caterer Dashboard"}
      </Heading>

      {/* ========== ADMIN VIEW ========== */}
      {isAdmin && adminData && (
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList mb={4}>
            <Tab>Users Overview</Tab>
            <Tab>Orders by User</Tab>
          </TabList>

          <TabPanels>
            {/* Users Overview */}
            <TabPanel>
              {/* Top cumulative summary */}
              <Flex gap={6} mb={4} fontWeight="bold">
                <Text>
                  Total Users: {adminData.users?.length || 0}
                </Text>
                <Text>
                  Total Orders:{" "}
                  {adminData.users
                    ?.reduce((sum, u) => sum + (u.ordersCount || 0), 0) || 0}
                </Text>
                <Text>
                  Total Cost: $
                  {(
                    adminData.users
                      ?.reduce((sum, u) => sum + (u.totalSpent || 0), 0) || 0
                  ).toFixed(2)}
                </Text>
              </Flex>

              <Flex justify="flex-end" mb={4}>
                <Button
                  onClick={() =>
                    downloadCSV(adminData.users || [], "users_overview.csv")
                  }
                >
                  Download CSV
                </Button>
              </Flex>

              {Object.entries(groupByDate(adminData.users || [], "createdAt"))
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, users]) => {
                  const dayOrders = users.reduce(
                    (sum, u) => sum + (u.ordersCount || 0),
                    0
                  );
                  const dayCost = users
                    .reduce((sum, u) => sum + (u.totalSpent || 0), 0)
                    .toFixed(2);
                  return (
                    <Box key={date} mb={8}>
                      <Heading size="md" mb={2}>
                        {formatHeading(date)}
                      </Heading>
                      <Text mb={2} fontStyle="italic">
                        Users: {users.length} | Orders: {dayOrders} | Cost: $
                        {dayCost}
                      </Text>

                      <Table variant="striped" colorScheme="transparent">
                        <Thead>
                          <Tr>
                            <Th>User</Th>
                            <Th>Email</Th>
                            <Th>Total Orders</Th>
                            <Th>Cumulative Spent</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {users.map((u) => (
                            <Tr key={u._id}>
                              <Td>
                                <Flex align="center" gap={3}>
                                  <Avatar
                                    src={
                                      u.profile_picture_id
                                        ? ProfileUrl(u.profile_picture_id)
                                        : ""
                                    }
                                    name={u.name}
                                    size="sm"
                                  />
                                  <Text>{u.name}</Text>
                                </Flex>
                              </Td>
                              <Td>{u.email}</Td>
                              <Td>{u.ordersCount}</Td>
                              <Td>{u.totalSpent?.toFixed(2)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  );
                })}
            </TabPanel>

            {/* Orders by User */}
            <TabPanel>
              <Flex justify="flex-end" mb={4}>
                <Button
                  colorScheme="orange"
                  onClick={() =>
                    downloadCSV(
                      adminData.ordersByUser || [],
                      "orders_by_user.csv"
                    )
                  }
                >
                  Download CSV
                </Button>
              </Flex>

              {Object.entries(
                groupByDate(adminData.ordersByUser || [], "latestOrderDate")
              )
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, orders]) => {
                  const dailyMeals = orders.reduce(
                    (sum, u) => sum + (u.totalMeals || 0),
                    0
                  );
                  return (
                    <Box key={date} mb={8}>
                      <Heading size="md" mb={2}>
                        {formatHeading(date)}
                      </Heading>
                      <Text mb={2} fontStyle="italic">
                        Users: {orders.length} | Total Meals: {dailyMeals}
                      </Text>

                      <Table variant="striped" colorScheme="transparent">
                        <Thead>
                          <Tr>
                            <Th>User</Th>
                            <Th>Meals Ordered</Th>
                            <Th>Total Meals</Th>
                            <Th>Feedback</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {orders.map((u) => (
                            <Tr key={u._id}>
                              <Td>
                                <Flex align="center" gap={3}>
                                  <Avatar
                                    src={
                                      u.profile_picture_id
                                        ? ProfileUrl(u.profile_picture_id)
                                        : ""
                                    }
                                    name={u.name}
                                    size="sm"
                                  />
                                  <Text>{u.name}</Text>
                                </Flex>
                              </Td>
                              <Td>
                                {u.meals.map((m, idx) => (
                                  <Badge key={idx} colorScheme="blue" mr={2}>
                                    {m.name} x {m.qty}
                                  </Badge>
                                ))}
                              </Td>
                              <Td>{u.totalMeals}</Td>
                              <Td>
                                {u.feedback ? (
                                  <Icon as={CheckCircleIcon} color="green.500" />
                                ) : (
                                  <Icon as={CloseIcon} color="red.500" />
                                )}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  );
                })}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      {/* ========== CATERER VIEW ========== */}
      {isCaterer && catererData && (
        <>
          <Flex justify="flex-end" mb={4}>
            <Button
              colorScheme="green"
              onClick={() => downloadCSV(catererData, "caterer_data.csv")}
            >
              Download CSV
            </Button>
          </Flex>

          {Object.entries(catererData)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, meals]) => {
              const totalOrders = meals.reduce(
                (sum, m) => sum + (m.totalOrders || 0),
                0
              );
              return (
                <Box key={date} mb={8}>
                  <Heading size="md" mb={2}>
                    {formatHeading(date)}
                  </Heading>
                  <Text mb={2} fontStyle="italic">
                    Meals: {meals.length} | Total Orders: {totalOrders}
                  </Text>

                  <Table variant="striped" colorScheme="transparent">
                    <Thead>
                      <Tr>
                        <Th>Meal</Th>
                        <Th>Total Orders</Th>
                        <Th>Users</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {meals.map((meal) => (
                        <Tr key={meal.mealName}>
                          <Td>{meal.mealName}</Td>
                          <Td>{meal.totalOrders}</Td>
                          <Td>
                            {meal.users.map((u, i) => (
                              <Badge key={i} colorScheme="purple" mr={2}>
                                {u}
                              </Badge>
                            ))}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              );
            })}
        </>
      )}
    </Box>
  );
}
