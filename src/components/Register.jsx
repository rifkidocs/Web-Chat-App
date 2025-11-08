import { auth } from "../firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Person, Envelope, Lock } from "react-bootstrap-icons";
import "./Register.css";

export default function Register() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: username,
            });
            setSuccess(true);
            setError(null);
        } catch (error) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setSuccess(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Buat Akun Baru</h1>
                <p className="register-subtitle">Daftar untuk memulai percakapan</p>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <Person className="input-icon" />
                        <input
                            type="text"
                            placeholder="Masukkan Username Anda"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Envelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Masukkan Email Anda"
                            onChange={() => setError(null)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Masukkan Password Anda"
                            onChange={() => setError(null)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && (
                        <p className="success-message">
                            Pendaftaran berhasil! Silakan <Link to="/">masuk</Link>.
                        </p>
                    )}
                    <button type="submit" className="register-button">Daftar</button>
                </form>
                <p className="login-link">
                    Sudah punya akun? <Link to="/">Masuk sekarang.</Link>
                </p>
            </div>
        </div>
    );
}
