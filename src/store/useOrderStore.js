import { create } from "zustand";

const useOrderStore = create((set) => ({
    orders: [], // All orders for this user (or admin, depending on view)
    selectedOrder: null, // The order currently being viewed (if needed)
    error: null,

    // ===== ORDER HANDLERS =====
    setOrders: (orders) => set({ orders }),

    addOrder: (order) =>
        set((state) => ({
            orders: [order, ...state.orders],
        })),

    deleteOrder: (orderId) =>
        set((state) => ({
            orders: state.orders.filter((order) => order._id !== orderId),
        })),

    updateOrder: (updatedOrder) =>
        set((state) => ({
            orders: state.orders.map((order) =>
                order._id === updatedOrder._id ? updatedOrder : order
            ),
        })),

    // ===== SELECTED ORDER HANDLERS =====
    setSelectedOrder: (order) => set({ selectedOrder: order }),
    clearSelectedOrder: () => set({ selectedOrder: null }),

    // ===== ERROR HANDLER =====
    setError: (error) => set({ error }),
}));

export default useOrderStore;
