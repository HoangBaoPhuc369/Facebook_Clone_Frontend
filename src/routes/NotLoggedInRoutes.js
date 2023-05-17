import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLoggedInRoutes({socketRef}) {
  const { user } = useSelector((state) => ({ ...state.auth }));
  // if (user) {
  //   socketRef.emit("joinUser", user.id);
  // }
  return user ? <Navigate to="/" /> : <Outlet />; //
}
