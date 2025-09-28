import { useState } from "react";
import useShowToast from "./useShowToast";

const apiUrl = import.meta.env.VITE_API_URL;

const useFoodActions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useShowToast();

    /* -------------------- ORDER ACTIONS -------------------- */

    const fetchUserOrders = async (userId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders/user/${userId}`);
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch orders");

            // ✅ Return everything including totalSpent to avoid null issues
            return {
                orders: data.orders || [],
                totalSpent: data.totalSpent || 0,
                nbHits: data.nbHits || 0,
            };
        } catch (err) {
            showToast("Error", err.message, "error");
            return { orders: [], totalSpent: 0, nbHits: 0 };
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders/all`);
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch all orders");
            return data.orders || [];
        } catch (err) {
            showToast("Error", err.message, "error");
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const createOrder = async (orderData) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to create order");
            showToast("Success", "Order placed successfully", "success");
            return data.order;
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to update status");
            showToast("Success", "Order status updated", "success");
            return data.order;
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOrder = async (orderId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders/${orderId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to delete order");
            showToast("Deleted", "Order removed successfully", "success");
            return true;
        } catch (err) {
            showToast("Error", err.message, "error");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTotalSpent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/foodorders/total`);
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch total");
            return data.total || 0;
        } catch (err) {
            showToast("Error", err.message, "error");
            return 0;
        } finally {
            setIsLoading(false);
        }
    };

    /* -------------------- MEAL ACTIONS -------------------- */

    const fetchMeals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/meals`);
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch meals");
            return data.meals || [];
        } catch (err) {
            showToast("Error", err.message, "error");
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const createMeal = async (mealData) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/meals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mealData),
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to create meal");
            showToast("Success", "Meal created successfully", "success");
            return data.meal;
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateMeal = async (mealId, updatedData) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/meals/${mealId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to update meal");
            showToast("Success", "Meal updated successfully", "success");
            return data.meal;
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMeal = async (mealId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/meals/${mealId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to delete meal");
            showToast("Deleted", "Meal removed successfully", "success");
            return true;
        } catch (err) {
            showToast("Error", err.message, "error");
            return false;
        } finally {
            setIsLoading(false);
        }
    };


    /* -------------------- FEEDBACK ACTION -------------------- */
    const createFeedback = async ({ userId, orderId, eaten, delivered, comment }) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/feedbacks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    orderId,
                    eaten,
                    delivered,
                    comment: comment || "",
                }),
            });

            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Failed to submit feedback");

            showToast("Success", "Feedback submitted successfully", "success");
            return data.feedback;
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/feedbacks`);
            const data = await res.json();

            if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch feedbacks");
            return data.feedbacks || [];
        } catch (err) {
            showToast("Error", err.message, "error");
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const updateFeedback = async (feedbackId, updatedData) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/feedbacks/${feedbackId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();
            if (!res.ok || data.error)
                throw new Error(data.error || "Failed to update feedback");

            showToast("Success", "Feedback updated successfully", "success");
            return data; // already populated
        } catch (err) {
            showToast("Error", err.message, "error");
            return null;
        } finally {
            setIsLoading(false);
        }
    };


    return {
        isLoading,
        // Orders
        fetchUserOrders,
        fetchAllOrders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        fetchTotalSpent,
        // Meals
        fetchMeals,
        createMeal,
        updateMeal,
        deleteMeal,

        // Feedback
        createFeedback,
        updateFeedback,
        fetchFeedbacks,
    };
};

export default useFoodActions;
