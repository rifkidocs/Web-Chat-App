import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import React, { useState } from "react";

export default function Login(props) {
	const [error, setError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target[0].value;
		const password = e.target[1].value;

		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			cookies.set("auth-token", result.user.refreshToken);
			props.setIsAuth(true);
			setError(false);
		} catch (error) {
			setError(true);
		}
	};

	return (
		<div className=" min-vh-100 d-flex justify-content-center align-items-center">
			<form
				onSubmit={handleSubmit}
				className="d-flex flex-column p-3 text-center"
			>
				<h1 className="fw-semibold form-label">Login ChatApp Rifki.</h1>
				<input
					className=" form-control my-2"
					type="text"
					placeholder="Masukkan Email Anda"
					onChange={() => {
						setError(null);
					}}
				/>
				<input
					className=" form-control my-2"
					type="password"
					placeholder="Masukkan Password Anda"
					onChange={() => {
						setError(null);
					}}
				/>
				{error && (
					<span style={{ color: "red" }}>Email / Password Tidak Cocok</span>
				)}
				<p className="my-2">
					Belum Punya Akun?{" "}
					<Link to="/register" className="">
						Daftar Sekarang.
					</Link>
				</p>
				<button className="btn btn-primary my-2">Login</button>
			</form>
		</div>
	);
}
