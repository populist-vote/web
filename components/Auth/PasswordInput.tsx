import { TextInput, TextInputProps } from "components/TextInput/TextInput";
import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

type PasswordInputProps = TextInputProps<any>;

function PasswordInput(props: PasswordInputProps) {
  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");
  return (
    <TextInput
      icon={
        passwordInputType === "password" ? (
          <FaEye
            color="var(--blue)"
            onClick={() => setPasswordInputType("text")}
            aria-label="show password"
          />
        ) : (
          <FaRegEyeSlash
            color="var(--blue)"
            onClick={() => setPasswordInputType("password")}
            aria-label="hide password"
          />
        )
      }
      type={passwordInputType}
      placeholder="Password"
      {...props}
    />
  );
}

export { PasswordInput };
