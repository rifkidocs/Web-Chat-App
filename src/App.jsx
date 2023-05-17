import "./App.css";
import React, { useState, useRef } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Room from "./components/Room";
import Register from "./components/Register";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
	const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
	const [room, setRoom] = useState(null);

	const roomInputRef = useRef(null);

	const signUserOut = async () => {
		await signOut(auth);
		cookies.remove("auth-token");
		setIsAuth(false);
		setRoom(null);
	};

	if (!isAuth) {
		return (
			<div>
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<Login setIsAuth={setIsAuth} />}/>
			<Route path="/register" element={<Register/>}/>
		</Routes>
		</BrowserRouter>
			</div>
		);
	}

	return (
		<>
			{room ? (
				<Chat room={room} signUserOut={signUserOut} />
			) : (
				<Room roomInputRef={roomInputRef} setRoom = {setRoom} signUserOut={signUserOut}/>
			)}
		</>
	);
}

export default App;
