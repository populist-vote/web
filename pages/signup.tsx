import { SignUp } from "components/SignUp/SignUp";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

export const SignUpPage: NextPage<{ step: string }> = ({ step }) => {
  return (
    <>
      <SignUp step={step} />
    </>
  );
};

export default SignUpPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      step: query.step ?? "email",
    },
  };
};
