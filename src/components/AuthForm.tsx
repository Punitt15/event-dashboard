"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  type: "login" | "signup";
};

const AuthForm = ({ type }: Props) => {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    let success = false;
    if (type === "login") {
      success = await login(values);
      if (success) router.push("/dashboard");
      else alert("Invalid credentials");
    } else {
      success = await signup(values);
      if (success) router.push("/dashboard");
      else alert("User already exists");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[94vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 capitalize text-center text-blue-700 drop-shadow-sm">
          {type === "login" ? "Login" : "Sign Up"}
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-6">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 w-full transition-all outline-none"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                aria-label="Password"
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 w-full transition-all outline-none"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-all duration-150 shadow-md disabled:opacity-60 disabled:cursor-not-allowed w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Processing...
                </span>
              ) : (
                type === "login" ? "Login" : "Sign Up"
              )}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
