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
          />
        ) : (
          <FaRegEyeSlash
            color="var(--blue)"
            onClick={() => setPasswordInputType("password")}
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
