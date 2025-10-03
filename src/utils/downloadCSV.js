// src/utils/downloadCSV.js

export const downloadCSV = (data, filename = "export.csv") => {
    if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }

    // Handle both arrays of objects and objects grouped by date
    let rows = [];

    if (Array.isArray(data)) {
        rows = data;
    } else if (typeof data === "object") {
        // Flatten catererData {date: [meals]} into one array
        Object.entries(data).forEach(([date, meals]) => {
            meals.forEach((meal) => {
                rows.push({
                    date,
                    meal: meal.mealName,
                    totalOrders: meal.totalOrders,
                    users: meal.users.join(", "),
                });
            });
        });
    } else {
        alert("Unsupported data format for CSV export.");
        return;
    }

    // Extract headers dynamically
    const headers = Object.keys(rows[0]);
    const csvContent = [
        headers.join(","), // header row
        ...rows.map((row) =>
            headers
                .map((field) => {
                    let val = row[field] ?? "";
                    // Escape quotes/commas
                    if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
                        val = `"${val.replace(/"/g, '""')}"`;
                    }
                    return val;
                })
                .join(",")
        ),
    ].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
