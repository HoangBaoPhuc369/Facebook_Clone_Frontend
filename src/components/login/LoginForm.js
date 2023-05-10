import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "../../components/inputs/loginInput";
import { useState } from "react";
import DotLoader from "react-spinners/DotLoader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./../../redux/features/authSlice";
const loginInfos = {
  email: "",
  password: "",
};
export default function LoginForm({ setVisible, socket }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(loginInfos);
  const { email, password } = formValue;
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required"),
  });
  const { loading, error } = useSelector((state) => ({ ...state.auth }));
  const loginSubmit = () => {
    if (email && password) {
      dispatch(login({ formValue, navigate, socket }));
    }
  };
  return (
    <div className="login_wrap">
      <div className="login_1">
        <img src="../../icons/netfriend.svg" alt="" />
        <span>
          Net Friend helps you connect and share with the people in your life.
        </span>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={loginSubmit}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  value={email}
                  name="email"
                  placeholder="Email address or phone number"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  value={password}
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="blue_btn">
                  Log In
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/reset" className="forgot_password">
            Forgotten password?
          </Link>
          <DotLoader color="#1876f2" loading={loading} size={30} />

          {error && <div className="error_text">{error}</div>}
          <div className="sign_splitter"></div>
          <button
            className="blue_btn open_signup"
            onClick={() => setVisible(true)}
          >
            Create Account
          </button>
        </div>
        <Link to="/" className="sign_extra">
          <b>Create a Page</b> for a celebrity, brand or business.
        </Link>
      </div>
    </div>
  );
}
