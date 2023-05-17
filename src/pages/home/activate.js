import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import ActivateForm from "./ActivateForm";
import "./style.css";
import { active } from './../../redux/features/authSlice';

export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loadingActive, errorActive, message } = useSelector((state) => ({ ...state.auth }));
  // const [success, setSuccess] = useState("");
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(true);
  const { token } = useParams();
  useEffect(() => {
    activateAccount();
  }, []);
  const activateAccount = () => {
    // try {
    //   setLoading(true);
    //   const { data } = await axios.post(
    //     `${process.env.REACT_APP_BACKEND_URL}/auth/activate`,
    //     { token },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     }
    //   );
    //   setSuccess(data.message);
    //   Cookies.set("user", JSON.stringify({ ...user, verified: true }));
    //   dispatch({
    //     type: "VERIFY",
    //     payload: true,
    //   });

    //   setTimeout(() => {
    //     navigate("/");
    //   }, 3000);
    // } catch (error) {
    //   setError(error.response.data.message);
    //   setTimeout(() => {
    //     navigate("/");
    //   }, 3000);
    // }

    dispatch(active({token, userToken: user.token, navigate}))
  };
  return (
    <div className="home">
      {message && (
        <ActivateForm
          type="success"
          header="Account verification succeded."
          text={message}
          loading={loadingActive}
        />
      )}
      {errorActive && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={errorActive}
          loading={loadingActive}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
}
