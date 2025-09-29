// src/components/WhiteCurveBackground.jsx
import { Box } from "@chakra-ui/react";

export default function WhiteCurvedBackground() {
    return (
        <Box
            position="absolute"
            bottom="0"
            left="0"
            w="100%"
            h="25vh"
            bg="white"
            borderTopLeftRadius="50% 20%"
            borderTopRightRadius="50% 20%"
            zIndex={0}
        />
    );
}
