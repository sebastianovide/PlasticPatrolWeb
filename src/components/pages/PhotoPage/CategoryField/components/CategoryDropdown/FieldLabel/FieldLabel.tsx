import React from "react";
import classnames from "classnames";

import "./FieldLabel.scss";

export type PropsToPass = {
  label: string;
  required?: boolean;
  className?: string;
};

type Props = {
  children: React.ReactElement;
} & PropsToPass;

export default function FieldLabel({
  label,
  required,
  children,
  className
}: Props) {
  return (
    <div className={classnames("FieldLabel__container", className)}>
      <p className={"FieldLabel__label"}>
        {label}
        {required && <span className={"FieldLabel__required"}> *</span>}
      </p>
      {children}
    </div>
  );
}
