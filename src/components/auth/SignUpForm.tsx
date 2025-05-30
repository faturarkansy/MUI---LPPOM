import { useState } from "react";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="flex items-center justify-center rounded-lg bg-white">
      <div>
        {/* sign in navigation */}
        {/* <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Back to dashboard
          </Link>
        </div> */}
        {/* main form */}
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="mb-5 sm:mb-8">
            <h2 className="text-2xl font-bold text-center">
              Welcome, Admin
              <br />
              <span className="text-black">Please Sign up to continue.</span>
            </h2>
          </div>
          <form className="space-y-4">
            {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label>
                        First Name<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="fname"
                        name="fname"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Last Name<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div> */}
            {/* <!-- Name --> */}
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
              />
            </div>
            {/* <!-- Email --> */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
              />
            </div>
            {/* <!-- Password --> */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>
            {/* <!-- Password Confirmation --> */}
            <div>
              <Label>Password Confirmation</Label>
              <div className="relative">
                <Input
                  placeholder="Confirmation your password"
                  type={showPasswordConfirm ? "text" : "password"}
                />
                <span
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPasswordConfirm ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>
            {/* <!-- Referral --> */}
            <div>
              <Label>Referral{" (Optional)"}</Label>
              <Input
                type="text"
                id="referral"
                name="referral"
                placeholder="Enter your refferal code"
                defaultValue=""
              />
            </div>
            {/* <!-- Checkbox --> */}
            {/* <div className="flex items-center gap-3">
                    <Checkbox
                      className="w-5 h-5"
                      checked={isChecked}
                      onChange={setIsChecked}
                    />
                    <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                      By creating an account means you agree to the{" "}
                      <span className="text-gray-800 dark:text-white/90">
                        Terms and Conditions,
                      </span>{" "}
                      and our{" "}
                      <span className="text-gray-800 dark:text-white">
                        Privacy Policy
                      </span>
                    </p>
                  </div> */}
            {/* <!-- Button --> */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded flex justify-center items-center gap-2"
            >
              Sign Up <FaArrowRight />
            </button>
          </form>
          <p className="text-sm text-center mt-5">
            Already have an account? {""}
            <Link to="/signin" className="font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
    // </div>
  );
}
