import React, { FunctionComponent } from "react";
import classnames from "classnames";

import "./FieldLabel.scss";

export type Props = {
  label?: string;
  required?: boolean;
  className?: string;
};

const FieldLabel: FunctionComponent<Props> = ({
  label,
  required,
  children,
  className
}) => {
  return (
    <div className={classnames("FieldLabel__container", className)}>
      <p className={"FieldLabel__label"}>
        {label}
        {required && <span className={"FieldLabel__required"}> *</span>}
      </p>
      {children}
    </div>
  );
};

export default FieldLabel;
