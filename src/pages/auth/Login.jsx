import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { HiOutlineLockClosed } from "react-icons/hi";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";

import loginImage from "../../assets/login-img.png";
import logo from "../../assets/optimus-logo.png";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useForm from "../../hooks/useForm";
import { loginApi } from "../../services/authService"; // ← add

const validate = (values) => {
  const errors = {};
  if (!values.username.trim())
    errors.username = "Username is required";
  if (!values.password)
    errors.password = "Password is required";
  return errors;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError]         = useState("");  // ← add
  const [loading, setLoading]           = useState(false); // ← add

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm({ username: "", password: "" }, validate);

  const onSubmit = async (formValues) => {  // ← make async
    try {
      setLoading(true);
      setApiError("");

      const response = await loginApi({
        username: formValues.username,
        password: formValues.password,
      });

      login(response.data); // ← save full user object { id, firstName, lastName, username, roleId, roleName }
      navigate("/search-patient");

    } catch (error) {
      if (error.response?.status === 401) {
        setApiError("Invalid Credentials");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF0FB] flex items-center justify-center p-4 md:p-8 lg:p-16">
      <div className="flex w-[85%] max-w-7xl h-[80vh] bg-white rounded-4xl shadow-xl overflow-hidden">

        {/* Left Section */}
        <div className="relative hidden md:block md:w-1/2">
          <img src={loginImage} alt="Care For Cancer" className="w-full h-full object-cover" />

          <div className="absolute top-6 left-8">
            <img src={logo} alt="Care for Cancer" className="h-14 w-auto" />
          </div>

          <div className="absolute top-34 left-20">
            <h2 className="font-heading font-bold text-3xl text-primary">Compassion.</h2>
            <h2 className="font-heading font-bold text-3xl text-primary">Care.</h2>
            <h2 className="font-heading font-bold text-3xl text-primary">Cure.</h2>
            <p className="mt-2 max-w-sm text-base text-blue-900">
              Care for Cancer is dedicated to supporting patients, caregivers, and healthcare professionals.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center p-6 md:px-14 md:py-16">
          <div className="w-full max-w-125">
            <h1 className="font-heading font-bold text-4xl leading-tight text-primary">Welcome back</h1>
            <p className="mt-3 text-sm text-textSecondary">Sign in to continue to Care for Cancer System</p>

            <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                leftIcon={<FaRegUser />}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.username}
                touched={touched.username}
              />
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                leftIcon={<HiOutlineLockClosed />}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                rightIcon={showPassword
                  ? <FaEyeSlash onClick={() => setShowPassword(false)} />
                  : <FaEye onClick={() => setShowPassword(true)} />
                }
              />

              {/* API error */}
              {apiError && (
                <div className="mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {apiError}
                </div>
              )}

              <div className="flex justify-end mb-4">
                <button type="button" className="text-primary text-sm font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}