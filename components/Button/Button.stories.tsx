/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { ComponentMeta } from "@storybook/react";

import { FaStar } from "react-icons/fa";

import { Button } from "./Button";

export default {
  component: Button,
  parameters: {
    backgrounds: {
      default: "dark-blue",
      values: [{ name: "dark-blue", value: "#002b41" }],
    },
  },
} as ComponentMeta<typeof Button>;

export const SingleButton = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} />;

SingleButton.story = {
  name: "Single button",
  parameters: {
    layout: "centered",
  },
};

SingleButton.args = {
  label: "Button",
  size: "large",
};

export const SingleButtonWithIcon = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} />;

SingleButtonWithIcon.story = {
  name: "Single button with Icon",
  parameters: {
    layout: "centered",
  },
};

SingleButtonWithIcon.args = {
  ...SingleButton.args,
  icon: <FaStar />,
};

export const IconButton = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} />;

IconButton.story = {
  name: "Icon button",
  parameters: {
    layout: "centered",
  },
};

IconButton.args = {
  ...SingleButtonWithIcon.args,
  hideLabel: true,
};

const PrimaryButton = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} variant="primary" />;
const SecondaryButton = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} variant="secondary" />;
const TextButton = (
  args: JSX.IntrinsicAttributes & {
    disabled?: boolean | undefined;
    hideLabel?: boolean | undefined;
    id?: string | undefined;
    icon?: React.ReactNode;
    iconPosition?: ("before" | "after") | undefined;
    label: string;
    onClick?: (() => unknown) | undefined;
    size: "large" | "small" | "medium";
    theme?: ("blue" | "yellow" | "red") | undefined;
    variant: "text" | "primary" | "secondary";
    type?: "button" | "submit" | undefined;
  } & { children?: React.ReactNode }
) => <Button {...args} variant="text" />;

const buttonGenerator = (args: any) => {
  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <div>
        <h1> Primary Buttons </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <PrimaryButton {...args} />
          <PrimaryButton {...args} icon={<FaStar />} />
          <PrimaryButton {...args} icon={<FaStar />} iconPosition="after" />
          <PrimaryButton {...args} icon={<FaStar />} hideLabel />
          <PrimaryButton {...args} icon={<FaStar />} hideLabel disabled />
          <PrimaryButton {...args} disabled />
        </div>
      </div>
      <div>
        <h1> Secondary Buttons </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <SecondaryButton {...args} />
          <SecondaryButton {...args} icon={<FaStar />} />
          <SecondaryButton {...args} icon={<FaStar />} iconPosition="after" />
          <SecondaryButton {...args} icon={<FaStar />} hideLabel />
          <SecondaryButton {...args} icon={<FaStar />} hideLabel disabled />
          <SecondaryButton {...args} disabled />
        </div>
      </div>
      <div>
        <h1> Text Buttons </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextButton {...args} />
          <TextButton {...args} icon={<FaStar />} />
          <TextButton {...args} icon={<FaStar />} iconPosition="after" />
          <TextButton {...args} disabled />
        </div>
      </div>
    </div>
  );
};

export const LargeButtons = (args: any) => buttonGenerator(args);

LargeButtons.args = SingleButton.args;
LargeButtons.story = {
  name: "Large Buttons",
  parameters: {
    layout: "centered",
  },
};

export const MediumButtons = (args: any) => buttonGenerator(args);

MediumButtons.args = {
  ...SingleButton.args,
  size: "medium",
};

MediumButtons.story = {
  name: "Medium Buttons",
  parameters: {
    layout: "centered",
  },
};

export const SmallButtons = (args: any) => buttonGenerator(args);

SmallButtons.args = {
  ...SingleButton.args,
  size: "small",
};

SmallButtons.story = {
  name: "Small Buttons",
  parameters: {
    layout: "centered",
  },
};
