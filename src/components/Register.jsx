import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Register() {
    const [error, setError] = useState(false);
    const [succes, setSucces] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            updateProfile(auth.currentUser, {
                displayName: username,
            });
            console.log(result);
            setSucces(true)
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
                <h1 className="fw-semibold form-label">Register ChatApp Rifki.</h1>
                <input
                    className=" form-control my-2"
                    type="text"
                    placeholder="Masukkan Username Anda"
                />
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
                    <span style={{ color: "red" }}>Terjadi Kesalahan</span>
                )}{succes && (
                    <span style={{ color: "green" }}>Pendaftaran Berhasil silahkan Login</span>
                )}
                <p className="my-2">
                    Sudah Punya Akun?{" "}
                    <Link to="/" className="">
                        Login Sekarang.
                    </Link>
                </p>
                <button className="btn btn-primary my-2">Daftar</button>
            </form>
        </div>
    );
}
