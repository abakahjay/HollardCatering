import { extendTheme } from "@chakra-ui/react";

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
 
export default theme;
