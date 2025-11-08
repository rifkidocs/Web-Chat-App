import { Link } from "react-router-dom";
import { auth } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import React, { useState } from "react";
import { Envelope, Lock } from "react-bootstrap-icons";
import "./Login.css";

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
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Selamat Datang!</h1>
                <p className="login-subtitle">Silakan masuk untuk melanjutkan</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <Envelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Masukkan Email Anda"
                            onChange={() => setError(false)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Masukkan Password Anda"
                            onChange={() => setError(false)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="error-message">Email atau Password salah.</p>
                    )}
                    <button type="submit" className="login-button">Masuk</button>
                </form>
                <p className="register-link">
                    Belum punya akun? <Link to="/register">Daftar sekarang.</Link>
                </p>
            </div>
        </div>
    );
}
