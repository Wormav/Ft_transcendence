import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import LoginStyle from "./LoginStyle";
import globalStyle from "../../globalStyle";
import { useTranslation } from "../../context/TranslationContext";
import { customFetch } from "../../utils/customFetch";

export default function Login() {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [loginError, setLoginError] = useState("");

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoginError("");

		if (!validateEmail(email)) {
			setEmailError(t("auth.login.emailError"));
			return;
		} else {
			setEmailError("");
		}

		try {
			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				},
			);

			const data = await response.json();

			if (response.ok) {
				document.cookie = `jwt=${data.token}; path=/; secure; samesite=strict`;
				window.location.href = "/";
			} else {
				if (response.status === 401) {
					setLoginError(t("auth.login.invalidCredentials"));
				} else {
					setLoginError(t("auth.login.networkError"));
				}
			}
		} catch (error: any) {
			console.error("Error during login:", error);
			if (error instanceof Error && error.message === "Unauthorized") {
				setLoginError(t("auth.login.invalidCredentials"));
			} else {
				setLoginError(t("auth.login.networkError"));
			}
		}
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (code) {
			document.cookie = `jwt=${code}; path=/; secure; samesite=strict`;
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	const handleGoogleLogin = () => {
		window.location.href = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/google/login`;
	};

	return (
		<div className={LoginStyle.container}>
			<div className={LoginStyle.card}>
				<div className={LoginStyle.logo}>
					<img src="/42_Logo.svg.png" alt="42 Logo" className="h-12 w-12" />
				</div>
				<h2 className={LoginStyle.title}>Ft_transcendence</h2>

				<div className="w-full">
					{" "}
					<div className="flex flex-col justify-center items-center">
						<h3 className="text-center mb-4 text-primary">
							{t("auth.login.title")}
						</h3>
						<div className={globalStyle.separator}></div>
					</div>
					<form className={LoginStyle.form} onSubmit={handleSubmit}>
						<div>
							<label className={LoginStyle.inputLabel}>
								{t("auth.login.email")}
							</label>
							<input
								type="email"
								className={LoginStyle.inputField}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							{emailError && (
								<p className="text-red-500 text-xs mt-1">{emailError}</p>
							)}
						</div>

						<div>
							<label className={LoginStyle.inputLabel}>
								{t("auth.login.password")}
							</label>
							<input
								type="password"
								className={LoginStyle.inputField}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							{loginError && (
								<p className="text-red-500 text-xs mt-1">{loginError}</p>
							)}
						</div>

						<button type="submit" className={LoginStyle.loginButton}>
							{t("auth.login.loginButton")}
						</button>

						<Link
							to={"/signup"}
							className={LoginStyle.accountText + " text-center"}
						>
							{t("auth.login.noAccount")}
						</Link>

						<button
							type="button"
							className={LoginStyle.googleButton}
							onClick={handleGoogleLogin}
						>
							<img
								src="https://accounts.google.com/favicon.ico"
								alt="Google"
								className="w-4 h-4"
							/>
							{t("auth.login.googleLogin")}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
