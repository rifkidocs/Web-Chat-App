import React, { useEffect, useState, useRef } from "react";
import {
	addDoc,
	collection,
	serverTimestamp,
	onSnapshot,
	query,
	where,
	orderBy,
	documentId,
	doc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import moment from "moment";
import Dropdown from "react-bootstrap/Dropdown";
import { ThreeDots, Trash, Reply } from "react-bootstrap-icons";

export default function Chat(props) {
	const { room } = props;
	let [messageNumber, setMessagesNumber] = useState(0);
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [replyMessage, setReplyMessage] = useState();
	const [img, setImg] = useState(false);
	const messageRef = collection(db, "messages");
	const storage = getStorage();
	let currentMessageNumber = messageNumber;

	// Mengupdate Chat
	useEffect(() => {
		const queryMessages = query(
			messageRef,
			where("room", "==", room),
			orderBy("createdAt")
		);
		const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
			let messages = [];
			snapshot.forEach((doc) => {
				messages.push({ ...doc.data(), id: doc.id });
			});
			setMessages(messages);
		});

		return () => unsuscribe();
	}, []);

	// Mengirim File
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Jika tidak ada pesan baru atau gambar yang dipilih, maka keluar dari fungsi
		if (!newMessage && !img) return;

		// Objek yang berisi data pesan yang akan ditambahkan ke Firebase Firestore
		const messageData = {
			room,
			text: newMessage,
			user: auth.currentUser.displayName,
			createdAt: serverTimestamp(),
			image: null,
		};

		// Jika ada gambar dan ada pesan yang dibalas, tambahkan data pesan dan data balasan ke Firestore
		if (img && replyMessage) {
			messageData.image = downloadURL;
			messageData.replyId = replyMessage;
			messageData.replyUser = messages[replyMessage].user;
			messageData.replyText = messages[replyMessage].text;
			messageData.replyImage = messages[replyMessage].image;
		}
		// Jika ada gambar dan tidak ada pesan yang dibalas, upload gambar ke Firebase Storage dan tambahkan data pesan ke Firestore
		else if (img) {
			const x = Math.random() * 1000;
			const file = e.target[1]?.files[0];
			const storageRef = ref(storage, `${x}${file.name}`);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				(error) => console.log(error),
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						addDoc(messageRef, {
							...messageData,
							image: downloadURL,
						});
					});
				}
			);
		}
		// Jika tidak ada gambar dan ada pesan yang dibalas, tambahkan data pesan dan data balasan ke Firestore
		else if (replyMessage) {
			messageData.replyId = replyMessage;
			messageData.replyUser = messages[replyMessage].user;
			messageData.replyText = messages[replyMessage].text;
			addDoc(messageRef, messageData);
		}
		// Jika tidak ada gambar dan tidak ada pesan yang dibalas, tambahkan data pesan ke Firestore
		else {
			addDoc(messageRef, messageData);
		}

		// Setelah data pesan berhasil ditambahkan ke Firestore, kosongkan nilai-nilai variabel untuk persiapan penggunaan selanjutnya
		setNewMessage("");
		setImg(false);
		setReplyMessage(null);
	};








	;

	return (
		<div className="d-flex justify-content-center bg-light p-3">
			<div className="card col-md-10 col-lg-8 col-xl-6 d-flex flex-column p-2 bg-white">
				<div className=" card-header d-flex justify-content-between align-items-end p-2 ">
					<button onClick={props.signUserOut} className="btn btn-danger">
						Log Out
					</button>
					<h4 className="fw-semibold">ChatApp</h4>
					<h5>{room.toUpperCase()}</h5>
				</div>
				<div className=" card-body d-flex flex-column">
					<button
						onClick={() => window.location.reload(false)}
						className="btn btn-light mb-3"
					>
						Kembali
					</button>

					<div className="">
						{messages.map((messageMap) => {
							currentMessageNumber = messageNumber;
							setMessagesNumber = messageNumber++;
							if (messageMap.user === auth.currentUser.displayName) {

								if (messageMap.replyId) {
									return (
										<div
											style={{ backgroundColor: "#3592c4" }}
											className="text-white container-fluid my-2 p-2 d-flex flex-column rounded text-end"
											key={messageMap.id}
										>

											<div
												style={{ backgroundColor: "#43b0e8" }}
												className="p-1 d-flex flex-column rounded my-1 text-start"
											>
												<div className="d-flex justify-content-between">
													<span className="fw-bold mx-2 ">
														{messageMap.replyUser}
													</span>
													<div className="mx-2"><Reply /></div>
												</div>
												{messageMap.image && (
													<span className="mx-2">
														<img
															src={messages[replyMessage].image}
															style={{ maxWidth: "10%" }}
															alt=""
														/>
													</span>
												)}
												<span className="mx-2 ">{messageMap.replyText}</span>
											</div>

											<div className="d-flex justify-content-between flex-row-reverse">
												<span className=" mx-2 fw-bold">{messageMap.user}</span>
												{messageMap.createdAt && (
													<span>
														{moment(messageMap.createdAt.toDate()).fromNow()}
													</span>
												)}
											</div>
											{messageMap.text && (
												<span className="mx-2 ">{messageMap.text}</span>
											)}
											{messageMap.image && (
												<span className="mx-2">
													<img
														src={messageMap.image}
														style={{ maxWidth: "40%" }}
														alt=""
													/>
												</span>
											)}
										</div>
									)
								}

								return (
									<div
										style={{ backgroundColor: "#3592c4" }}
										className="text-white container-fluid my-2 p-2 d-flex flex-column rounded text-end"
										key={messageMap.id}
									>
										<div className="d-flex justify-content-between flex-row-reverse">
											<span className=" mx-2 fw-bold">{messageMap.user}</span>
											{messageMap.createdAt && (
												<span>
													{moment(messageMap.createdAt.toDate()).fromNow()}
												</span>
											)}
										</div>
										{messageMap.text && (
											<span className="mx-2 ">{messageMap.text}</span>
										)}
										{messageMap.image && (
											<span className="mx-2">
												<img
													src={messageMap.image}
													style={{ maxWidth: "40%" }}
													alt=""
												/>
											</span>
										)}
									</div>
								);
							}

							if (messageMap.replyId) {
								return (
									<div
										style={{ backgroundColor: "#f5f6f7" }}
										className="text-black container-fluid my-2 p-2 d-flex flex-column rounded text-start"
										key={messageMap.id}
									>

										<div
											style={{ backgroundColor: "#dedede" }}
											className="p-1 d-flex flex-column rounded my-1 text-start "
										>
											<div className="d-flex justify-content-between">
												<span className="fw-bold mx-2 ">
													{messageMap.replyUser}
												</span>
												<div className="mx-2"><Reply /></div>
											</div>
											{messageMap.image && (
												<span className="mx-2">
													<img
														src={messages[replyMessage].image}
														style={{ maxWidth: "10%" }}
														alt=""
													/>
												</span>
											)}
											<span className="mx-2 ">{messageMap.replyText}</span>
										</div>

										<div className="d-flex justify-content-between flex-row">
											<span className=" mx-2 fw-bold">{messageMap.user}</span>
											<div className="d-flex">
												<Dropdown>
													<Dropdown.Toggle variant="btn mx-1 p-0 px-2">
														<ThreeDots fill="black" />
													</Dropdown.Toggle>
													<Dropdown.Menu>
														<Dropdown.Item>
															<button
																id={currentMessageNumber}
																onClick={(e) => {
																	console.log(messages[e.target.id]);
																	setReplyMessage(e.target.id);
																}}
																className="btn p-0"
															>
																Balas
															</button>
														</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown>
												{messageMap.createdAt && (
													<span>
														{moment(messageMap.createdAt.toDate()).fromNow()}
													</span>
												)}
											</div>
										</div>
										{messageMap.text && (
											<span className="mx-2 ">{messageMap.text}</span>
										)}
										{messageMap.image && (
											<span className="mx-2">
												<img
													src={messageMap.image}
													style={{ maxWidth: "40%" }}
													alt=""
												/>
											</span>
										)}
									</div>
								)
							}


							return (
								<div
									style={{ backgroundColor: "#f5f6f7" }}
									className="my-2 p-1 w-auto d-flex flex-column rounded"
									key={messageMap.id}
								>
									<div className="d-flex justify-content-between">
										<span className=" mx-2 fw-bold">{messageMap.user}</span>
										<div className=" d-flex">
											<Dropdown>
												<Dropdown.Toggle variant="btn mx-1 p-0 px-2">
													<ThreeDots fill="black" />
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item>
														<button
															id={currentMessageNumber}
															onClick={(e) => {
																console.log(messages[e.target.id]);
																setReplyMessage(e.target.id);
															}}
															className="btn p-0"
														>
															Balas
														</button>
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
											{messageMap.createdAt && (
												<span>
													{moment(messageMap.createdAt.toDate()).fromNow()}
												</span>
											)}
										</div>
									</div>
									{messageMap.text && (
										<span className="mx-2 ">{messageMap.text}</span>
									)}
									{messageMap.image && (
										<span className="mx-2">
											<img
												src={messageMap.image}
												style={{ maxWidth: "200px" }}
												alt=""
											/>
										</span>
									)}
								</div>
							);
						})}
					</div>

					<form onSubmit={handleSubmit} className="d-flex flex-column">
						{replyMessage && (
							<div
								style={{ backgroundColor: "#43b0e8" }}
								className="p-1 w-auto d-flex flex-column rounded text-white"
							>
								<div className=" d-flex justify-content-between">
									<span className="fw-bold mx-2 ">
										{messages[replyMessage].user}
									</span>
									<button className="btn" onClick={() => { setReplyMessage(null) }}><Trash fill="white" /></button>
								</div>
								{messages[replyMessage].image && (
									<span className="mx-2">
										<img
											src={messages[replyMessage].image}
											style={{ maxWidth: "10%" }}
											alt=""
										/>
									</span>
								)}
								<span className="mx-2 ">{messages[replyMessage].text}</span>
							</div>
						)}

						<div className="d-flex">
							<input
								className=" form-control w-100 rounded"
								placeholder="Tulis pesanmu disini..."
								onChange={(e) => setNewMessage(e.target.value)}
								value={newMessage}
							/>
							<input
								type="file"
								id="file"
								onChange={(e) => {
									setImg(true);
								}}
								className="btn btn-light ms-1"
								style={{ maxWidth: "35%" }}
							/>
							<button type="submit" className="btn btn-light ms-1">
								Kirim
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
