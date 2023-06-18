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
  const { token } = useParams();
  useEffect(() => {
    activateAccount();
  }, []);
  const activateAccount = () => {
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
