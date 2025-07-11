"use client"
import React, { useEffect }  from "react";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";

const Page = () => {

  const dispatch = useAppDispatch();

  const { userData} = useAppSelector((state) => state.auth);

  // console.log("this is my userdata in blog info page", userData);
  // console.log("this is my userdata in blog info page", isLoggedIn);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);



  return (
    <div>
      <p>{userData?.username}</p>
      <p>{userData?.id}</p>
      <p>{userData?.phone}</p>
      <p>{userData?.email}</p>
    </div>
  );
};

export default Page;
