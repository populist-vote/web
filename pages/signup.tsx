import { SignUp } from "components/SignUp/SignUp";
import { NextPage } from "next";
import { useState } from "react";

export const SignUpPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <SignUp />
    </>
  );
};

export default SignUpPage;
