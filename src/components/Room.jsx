import React, { useState } from "react";
import { BoxArrowRight } from "react-bootstrap-icons";
import "./Room.css";

const rooms = ["Ruang 1", "Ruang 2", "Ruang 3"];

export default function Room(props) {
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleEnterRoom = () => {
        if (selectedRoom) {
            props.setRoom(selectedRoom);
        } else {
            alert("Mohon pilih ruangan terlebih dahulu.");
        }
    };

    return (
        <div className="room-container">
            <div className="room-card">
                <button onClick={props.signUserOut} className="logout-button">
                    <BoxArrowRight size={20} />
                    <span>Log Out</span>
                </button>
                <h1 className="room-title">Pilih Ruangan</h1>
                <p className="room-subtitle">Pilih ruangan untuk memulai percakapan</p>
                <div className="room-list">
                    {rooms.map((room) => (
                        <div
                            key={room}
                            className={`room-item ${selectedRoom === room ? "selected" : ""}`}
                            onClick={() => setSelectedRoom(room)}
                        >
                            {room}
                        </div>
                    ))}
                </div>
                <button onClick={handleEnterRoom} className="enter-room-button">
                    Masuk Ruangan
                </button>
            </div>
        </div>
    );
}
