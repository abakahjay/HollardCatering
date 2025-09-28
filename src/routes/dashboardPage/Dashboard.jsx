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

  const handleNewChat = async (trimmed) => {
    setLoading(true);

    try {
      const chatData = { text: "New Food Order" };
      const newChat = await createUserChat(userId, chatData, true);
      if (newChat?._id) {
        navigate(`/chat/${newChat._id}`);
      }
    } catch (err) {
      showToast("Error", "Could not create order", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed && !fileInfo) return;

  // Save query to localStorage (for use in Find Meal page)
  localStorage.setItem("searchItems", JSON.stringify([trimmed]));

  // Clear fileInfo if present
  if (fileInfo) {
    localStorage.setItem("fileInfo", JSON.stringify(fileInfo));
  }

  // Navigate to Find Meal page with query as URL param
  navigate(`/findmeal?search=${encodeURIComponent(trimmed)}`);

  // Reset input state
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
      bg="#4B226F" // Hollard Purple
      overflow="hidden"
    >
      {/* White curve at bottom */}
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

      {/* Main content on top */}
      <Box w={{ base: "100%", md: "60%" }} maxW="700px" zIndex={1}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={6}
          color="#F15A22"
          textAlign="center"
        >
          🍔 What would you like to eat today?
        </Text>

        {/* Quick food suggestions */}
        <Flex justify="center" gap={3} mb={4} wrap="wrap">
          {["Waakye", "Jollof", "Burger", "Kenkey", "Banku"].map(
            (food) => (
              <Button
                key={food}
                size="sm"
                bg="#F15A22"
                color="white"
                _hover={{ bg: "#d94e1f" }}
                onClick={() => setInput(food)}
              >
                {food}
              </Button>
            )
          )}
        </Flex>

        {/* Input + Mic + Send */}
        <Flex
          direction="column"
          bg="rgba(75, 37, 108, 0.85)"
          borderRadius="xl"
          px={4}
          py={4}
          boxShadow="lg"
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

          <Flex
            align="center"
            gap={2}
            borderRadius="md"
            px={2}
            py={2}
            border="1px solid #EDE6F3"
            bg="transparent"
          >
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
              border="1px solid transparent"
              flex={1}
              _focus={{ borderColor: "#F15A22" }}
              css={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#F15A22",
                  borderRadius: "6px",
                },
              }}
            />

            {/* Mic Button */}
            <IconButton
              icon={<FaMicrophone />}
              variant="ghost"
              aria-label="Mic"
              color="white"
              bg="transparent"
              _hover={{ bg: "#6A3C8C" }}
              onClick={startListening}
            />

            {/* Send/Order Button */}
            <IconButton
              icon={<BsCartFill />}
              aria-label="Send Order"
              onClick={handleSend}
              isRound
              bg={input.trim() ? "#F15A22" : "transparent"}
              color={input.trim() ? "white" : "gray.400"}
              _hover={input.trim() ? { bg: "#d94e1f" } : { bg: "gray.700" }}
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Dashboard;
