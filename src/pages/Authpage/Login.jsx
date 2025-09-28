import  { useState } from "react";
import {
	Alert,
	AlertIcon,
	Button,
	Input,
	Box,
	VStack,
	Text,
} from "@chakra-ui/react";
import useLogin from "../../hooks/useLogin";
const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
	const { login, isLoading, error } = useLogin();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showReset, setShowReset] = useState(false);
	const [resetMsg, setResetMsg] = useState(null);
	const [resetError, setResetError] = useState(false);
	const [resetLoading, setResetLoading] = useState(false);

	// Login handler
	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	// Forgot password handler
	const handleReset = async (e) => {
		e.preventDefault();
		setResetLoading(true);
		setResetMsg(null);
		setResetError(false);

		try {
			const res = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();
			if (res.ok) {
				setResetMsg(data.message || "Reset link sent!");
			} else {
				setResetError(true);
				setResetMsg(data.msg || "Reset failed.");
			}
		} catch (err) {
			console.error(err);
			setResetError(true);
			setResetMsg("Something went wrong. Please try again.");
		} finally {
			setResetLoading(false);
		}
	};

	return (
		<VStack spacing={3} align="stretch" padding="none">
			{!showReset ? (
				<>
					<Input
						placeholder="Email"
						fontSize={14}
						type="email"
						size="sm"
						// w="full"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						placeholder="Password"
						fontSize={14}
						size="sm"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{error && (
						<Alert status="error" fontSize={13} p={2} borderRadius={4}>
							<AlertIcon fontSize={12} />
							{error}
						</Alert>
					)}

					<Button
						w="full"
						colorScheme="blue"
						size="sm"
						fontSize={14}
						isLoading={isLoading}
						onClick={handleSubmit}
					>
						Log in
					</Button>

					<Box
						as="button"
						color="blue.400"
						fontSize="sm"
						onClick={() => setShowReset(true)}
					>
						Forgot your password?
					</Box>
				</>
			) : (
				<>
					<Text fontSize="lg" fontWeight="bold">
						Reset Password
					</Text>
					<Text fontSize="sm" color="gray.600">
						Enter your email to receive a reset link.
					</Text>

					<Input
						placeholder="Email"
						fontSize={14}
						type="email"
						size="sm"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					{resetMsg && (
						<Alert
							status={resetError ? "error" : "success"}
							fontSize={13}
							p={2}
							borderRadius={4}
						>
							<AlertIcon fontSize={12} />
							{resetMsg}
						</Alert>
					)}

					<Button
						w="full"
						colorScheme="blue"
						size="sm"
						fontSize={14}
						isLoading={resetLoading}
						onClick={handleReset}
					>
						Send Reset Link
					</Button>

					<Box
						as="button"
						color="blue.400"
						fontSize="sm"
						onClick={() => setShowReset(false)}
					>
						Back to Login
					</Box>
				</>
			)}
		</VStack>
	);
}
