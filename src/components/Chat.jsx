import React, { useEffect, useState, useRef } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase-config.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from "moment";
import { ArrowLeft, ThreeDotsVertical, Reply, Trash, Paperclip, Send } from "react-bootstrap-icons";
import "./Chat.css";

export default function Chat(props) {
    const { room } = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState(null);
    const [img, setImg] = useState(null);
    const messageRef = collection(db, "messages");
    const storage = getStorage();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const queryMessages = query(
            messageRef,
            where("room", "==", room),
            orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });
        return () => unsubscribe();
    }, [room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImg(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !img) return;

        const messageData = {
            room,
            text: newMessage,
            user: auth.currentUser.displayName,
            createdAt: serverTimestamp(),
            image: null,
            replyTo: replyMessage,
        };

        if (img) {
            const storageRef = ref(storage, `images/${Date.now()}_${img.name}`);
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                "state_changed",
                null,
                (error) => console.error(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await addDoc(messageRef, { ...messageData, image: downloadURL });
                }
            );
        } else {
            await addDoc(messageRef, messageData);
        }

        setNewMessage("");
        setImg(null);
        setReplyMessage(null);
    };

    return (
        <div className="chat-container">
            <div className="chat-card">
                <div className="chat-header">
                    <button onClick={() => window.location.reload()} className="back-button">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="room-info">
                        <h4 className="room-name">{room.toUpperCase()}</h4>
                        <p className="room-status">Online</p>
                    </div>
                    <button onClick={props.signUserOut} className="logout-button-chat">
                        Log Out
                    </button>
                </div>
                <div className="chat-body">
                    {messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            isCurrentUser={message.user === auth.currentUser.displayName}
                            onReply={() => setReplyMessage(message)}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-footer">
                    {replyMessage && (
                        <div className="reply-preview">
                            <div className="reply-info">
                                <p className="reply-user">Membalas kepada <strong>{replyMessage.user}</strong></p>
                                <p className="reply-text">{replyMessage.text}</p>
                            </div>
                            <button onClick={() => setReplyMessage(null)} className="cancel-reply-button">
                                <Trash size={16} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="message-form">
                        <input
                            type="text"
                            className="message-input"
                            placeholder="Tulis pesanmu di sini..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <label htmlFor="file-upload" className="attach-button">
                            <Paperclip size={20} />
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} />
                        <button type="submit" className="send-button">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const Message = ({ message, isCurrentUser, onReply }) => {
    return (
        <div className={`message-wrapper ${isCurrentUser ? "sent" : "received"}`}>
            <div className="message-content">
                {!isCurrentUser && <p className="message-user">{message.user}</p>}
                {message.replyTo && (
                    <div className="replied-to">
                        <p className="replied-user"><strong>{message.replyTo.user}</strong></p>
                        <p>{message.replyTo.text}</p>
                    </div>
                )}
                {message.image && <img src={message.image} alt="attachment" className="message-image" />}
                <p className="message-text">{message.text}</p>
                <div className="message-meta">
                    <p className="message-time">{moment(message.createdAt?.toDate()).format("HH:mm")}</p>
                    {!isCurrentUser && (
                        <button onClick={onReply} className="reply-button">
                            <Reply size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
