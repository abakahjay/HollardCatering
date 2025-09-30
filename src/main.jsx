import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // This is for extra styles
import "./main.css"; // This is for extra styles
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// ✅ Define Hollard theme
const theme = extendTheme({
    colors: {
        hollard: {
            purple: "#4B226F",       // main background
            purpleLight: "#6E3C8F",  // hover / card bg
            purpleLighter: "#A18EB5",// subtle texts / borders
            orange: "#F15A22",       // main CTA color
            orangeHover: "#d94e1f",  // darker hover
            white: "#FFFFFF",
        },
    },
    styles: {
        global: {
            body: {
                bg: "hollard.purple",  // page background
                color: "hollard.white",// default text
                fontFamily: "Arial, sans-serif",
                // bgGradient="linear(to-br, #4B226F, #2D0A45)" 
            },
            a: {
                color: "hollard.orange",
                _hover: { color: "hollard.orangeHover" },
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: "xl",
                fontWeight: "bold",
            },
            variants: {
                solid: {
                    bg: "hollard.orange",
                    color: "white",
                    _hover: {
                        bg: "hollard.orangeHover",
                    },
                },
                outline: {
                    border: "2px solid",
                    borderColor: "hollard.orange",
                    color: "hollard.orange",
                    _hover: {
                        bg: "hollard.orange",
                        color: "white",
                    },
                },
                ghost: {
                    color: "white",
                    _hover: { bg: "hollard.purpleLight" },
                },
            },
        },
        Heading: {
            baseStyle: {
                color: "hollard.orange",
                fontWeight: "bold",
            },
        },
        Textarea: {
            baseStyle: {
                bg: "transparent",
                border: "1px solid transparent",
                color: "white",
                _focus: { borderColor: "hollard.orange" },
                _placeholder: { color: "hollard.purpleLighter" },
            },
        },
        Input: {
            baseStyle: {
                field: {
                    bg: "transparent",
                    border: "1px solid transparent",
                    color: "white",
                    _focus: { borderColor: "hollard.orange" },
                    _placeholder: { color: "hollard.purpleLighter" },
                },
            },
        },
    },
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
            console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </StrictMode>
);

console.log("Hello world");
