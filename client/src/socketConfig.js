import { io } from "socket.io-client";

// const socket = io("http://localhost:8900");

const socket = io(process.env.REACT_APP_SOCKET_URL);

export default socket;
