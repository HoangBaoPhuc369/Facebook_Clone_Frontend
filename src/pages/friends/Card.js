import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  acceptRequest,
  cancelRequest,
  deleteRequest,
} from "../../redux/features/friendsSlice";

export default function Card({ userr, type }) {
  const { user } = useSelector((state) => ({ ...state.auth }));

  const dispatch = useDispatch();

  const cancelRequestHandler = (userId) => {
    dispatch(
      cancelRequest({
        userId: userId,
        token: user.token,
      })
    );
  };
  const confirmHandler = (userId) => {
    dispatch(
      acceptRequest({
        userId: userId,
        token: user.token,
      })
    );
  };
  const deleteHandler = (userId) => {
    dispatch(
      deleteRequest({
        userId: userId,
        token: user.token,
      })
    );
  };
  return (
    <div className="req_card">
      <Link to={`/profile/${userr.username}`}>
        <img src={userr.picture} alt="" />
      </Link>
      <div className="req_name">
        {userr.first_name} {userr.last_name}
      </div>
      {type === "sent" ? (
        <button
          className="blue_btn"
          onClick={() => cancelRequestHandler(userr._id)}
        >
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button
            className="blue_btn"
            onClick={() => confirmHandler(userr._id)}
          >
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteHandler(userr._id)}>
            Delete
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
