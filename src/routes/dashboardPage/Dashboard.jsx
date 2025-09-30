import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Textarea,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";
import { BsCartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useAiChatActions from "../../hooks/useAiChatActions";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/useAuthStore.js";
import useHandleMessageSend from "../../hooks/useHandleMessageSend";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [transcript, setTranscript] = useState("");
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const authUser = useAuthStore((state) => state.user);
  const { createUserChat } = useAiChatActions();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = authUser.user ? authUser.user : authUser;
  const userId = user._id;
  const { handleMessageSend } = useHandleMessageSend();

  const handleSend = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed && !fileInfo) return;

    localStorage.setItem("searchItems", JSON.stringify([trimmed]));
    if (fileInfo) {
      localStorage.setItem("fileInfo", JSON.stringify(fileInfo));
    }
    navigate(`/findmeal?search=${encodeURIComponent(trimmed)}`);
    setInput("");
    setTranscript("");
    setFileInfo(null);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setInput(transcript);
    setTranscript("");
  };

  const cancelListening = () => {
    recognitionRef.current?.abort();
    setTranscript("");
  };

  return (
    <Flex
      h="100vh"
      justify="center"
      align="center"
      px={4}
      position="relative"
      bgGradient="linear(to-br, #4B226F, #2D0A45)"
      overflow="hidden"
    >
      {/* Smooth SVG curve at bottom */}
      <Box position="absolute" bottom="0" w="100%" zIndex={0}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "180px" }}
        >
          <path
            fill="white"
            d="M0,224L60,208C120,192,240,160,360,170.7C480,181,600,235,720,250.7C840,267,960,245,1080,213.3C1200,181,1320,139,1380,117.3L1440,96V320H0Z"
          />
        </svg>
      </Box>

      {/* Main content */}
      <Box w={{ base: "100%", md: "60%" }} maxW="700px" zIndex={1}>
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="extrabold"
          mb={6}
          color="#F15A22" // Hollard orange
          textAlign="center"
          letterSpacing="0.5px"
        >
          🍔 What would you like to eat today?
        </Text>

        {/* Food suggestions */}
        <Flex justify="center" gap={3} mb={6} wrap="wrap">
          {["Waakye", "Jollof", "Beans", "Kenkey", "Banku"].map((food) => (
            <Button
              key={food}
              size="md"
              bg="#F15A22"
              color="white"
              px={5}
              borderRadius="full"
              _hover={{ bg: "#d94e1f", transform: "scale(1.05)" }}
              transition="all 0.2s ease-in-out"
              onClick={() => setInput(food)}
            >
              {food}
            </Button>
          ))}
        </Flex>

        {/* Input box with mic + send */}
        <Flex
          direction="column"
          borderRadius="2xl"
          px={5}
          py={5}
          bg="rgba(75, 37, 108, 0.85)"
          boxShadow="0 8px 24px rgba(0,0,0,0.25)"
          backdropFilter="blur(10px)"
        >
          {transcript && (
            <Flex
              justify="space-between"
              align="center"
              bg="whiteAlpha.300"
              px={3}
              py={2}
              borderRadius="md"
              mb={3}
              color="white"
              fontSize="sm"
              wrap="wrap"
            >
              <Text flex="1">{transcript}</Text>
              <Button
                size="sm"
                colorScheme="green"
                borderRadius="full"
                mr={2}
                onClick={stopListening}
              >
                Correct
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                borderRadius="full"
                onClick={cancelListening}
              >
                Close
              </Button>
            </Flex>
          )}

          <Flex align="center" gap={2}>
            <Textarea
              placeholder="Search meals or type your order..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              resize="none"
              maxHeight="150px"
              overflowY="auto"
              color="white"
              bg="transparent"
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="xl"
              flex={1}
              _focus={{
                borderColor: "#F15A22",
                boxShadow: "0 0 0 1px #F15A22",
              }}
              css={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#F15A22",
                  borderRadius: "6px",
                },
              }}
            />

            <IconButton
              icon={<FaMicrophone />}
              aria-label="Mic"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={startListening}
            />

            <IconButton
              icon={<BsCartFill />}
              aria-label="Send Order"
              onClick={handleSend}
              isRound
              bg={input.trim() ? "#F15A22" : "whiteAlpha.200"}
              color="white"
              _hover={input.trim() ? { bg: "#d94e1f" } : { bg: "whiteAlpha.300" }}
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Dashboard;
