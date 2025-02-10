/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const SignOut = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  //   if (!auth) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   return children;

  useEffect(() => {
    logout();
    navigate("/login");
  });
  return <>Log Out</>;
};

export default SignOut;
