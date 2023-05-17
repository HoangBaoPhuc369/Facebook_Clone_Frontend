import { useDispatch } from "react-redux";
import { setError } from "../../redux/features/postSlice";

export default function PostError({ error}) {
  const dispatch = useDispatch();
  return (
    <div className="postError">
      <div className="postError_error">{error}</div>
      <button
        className="blue_btn"
        onClick={() => {
          dispatch(setError(""));
        }}
      >
        Try again
      </button>
    </div>
  );
}
