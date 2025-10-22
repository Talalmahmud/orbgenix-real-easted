"use server";
import { cookies } from "next/headers";

export const userLogin = async (data: {
  username: string;
  password: string;
}) => {
  console.log(data);
  const res = await fetch(process.env.NEXT_PUBLIC_URL + "/users/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: data.username, password: data.password }),
  });
  const resData = await res.json();
  console.log(resData);
  const cookie = await cookies();

  if (res.ok) {
    cookie.set("accessToken", resData.access);
    cookie.set("refreshToken", resData.refresh);
    return true;
  } else return false;
};
