import React, { useState, useEffect } from "react";
import classnames from "classnames";

import FieldLabel, { PropsToPass } from "./FieldLabel";

import "./FieldLabelWithInput.scss";

type Props = {
  validationFn: (value: string) => boolean;
  value: string;
  placeholder: string;
  setValue: (value: string) => void;
} & PropsToPass;

const FieldLabelWithInput = ({
  validationFn,
  value,
  setValue,
  placeholder,
  ...fieldLabelProps
}: Props) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof validationFn === "function") {
      setError(!validationFn(value));
    }
  }, [value, validationFn]);

  return (
    <FieldLabel {...fieldLabelProps}>
      <input
        placeholder={placeholder}
        className={classnames("FieldLabelWithInput", {
          FieldLabelWithInput__Error: error
        })}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </FieldLabel>
  );
};

export default FieldLabelWithInput;
