import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login";

export default function LoggedInRoutes({ socketRef }) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  // if (user) {
  //   socketRef.emit("joinUser", user.id);
  // }
  return user ? <Outlet /> : <Login socketRef={socketRef} />;
}
