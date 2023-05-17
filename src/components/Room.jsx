import React from "react";

export default function Room(props) {
	return (
		<div className=" min-vh-100 d-flex justify-content-center align-items-center">
			<div className="d-flex flex-column p-2 text-center">
				<h1>Pilih Nomor Ruangan :</h1>
				<select className="form-select my-3" aria-label="Default select example" ref={props.roomInputRef}>
					<option value="belum" selected>Pilih Ruangan</option>
					<option value="Ruang 1">Ruang 1</option>
					<option value="Ruang 2">Ruang 2</option>
					<option value="Ruang 3">Ruang 3</option>
				</select>
				<button
					className="btn btn-primary"
					onClick={() => {
                        if (props.roomInputRef.current.value === "belum") {
                            window.alert("Mohon Pilih Ruangan Terlebih Dahulu")
                        } else{
                            props.setRoom(props.roomInputRef.current.value)
                        } 
                        
                    }}
				>
					Masuk Ruang 
				</button>
                <button onClick={props.signUserOut} className="btn btn-danger mt-3">
						Log Out
					</button>
			</div>
		</div>
	);
}
