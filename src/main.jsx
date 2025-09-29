import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';//This is for the styles
import './main.css';//This is for the styles
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";
// import { BrowserRouter } from "react-router-dom";

//We can also import React and ReactDOM from the modules above without the curly braises
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
    }).catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
}


// const styles = {
//   global: (props) => ({
//     body: {
//       bg: mode("gray.100", "#000")(props),
//       color: mode("gray.800", "whiteAlpha.900")(props),
//     },
//   }),
// };

// const config = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// };


const theme = extendTheme({
    colors: {
        hollard: {
            purple: "#4B226F",
            purpleLight: "#6E3C8F",
            purpleLighter: "#A18EB5",
            orange: "#F15A24",
            white: "#FFFFFF"
        }
    },
    styles: {
        global: {
            body: {
                bg: "hollard.purple",
                color: "hollard.white",
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: "xl",
                fontWeight: "bold"
            },
            variants: {
                solid: {
                    bg: "hollard.orange",
                    color: "white",
                    _hover: {
                        bg: "hollard.purpleLight",
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
            },
        },
        Heading: {
            baseStyle: {
                color: "hollard.orange",
            },
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            {/* THis is for Creating Routes and Pages */}
            <App />
        </ChakraProvider>
    </StrictMode>
)
console.log('Hello world')
