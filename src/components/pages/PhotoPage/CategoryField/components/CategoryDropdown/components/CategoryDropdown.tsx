import React, { useRef } from "react";
import Select, { components, ValueType } from "react-select";

import MenuItem from "@material-ui/core/MenuItem";

import data from "custom/categories.json";

import FieldLabel, { Props as FieldLabelProps } from "../FieldLabel";

import { customFilterOption, getDropdownOptions } from "../utils";
import "./CategoryDropdown.scss";
import { KeyedCategoryData, CategoryOption } from "types/Category";

function Control(props: any) {
  return <components.Control {...props} className="Dropdown__control" />;
}

function Option(props: any) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Menu(props: any) {
  return <components.Menu {...props} className="Dropdown__menu" />;
}

function NoOptionsMessage(props: any) {
  return <p className={"Dropdown__noOptionsMessage"}>{props.children}</p>;
}

function Placeholder(props: any) {
  return (
    <p className={"Dropdown__placeHolder"} {...props.innerProps}>
      {props.children}
    </p>
  );
}

function ValueContainer(props: any) {
  return <div className="Dropdown__valueContainer">{props.children}</div>;
}

function DropdownIndicator(props: any) {
  return null;
}

function IndicatorSeparator(props: any) {
  return null;
}

function ClearIndicator(props: any) {
  return null;
}

const customComponents = {
  Control,
  Option,
  Menu,
  NoOptionsMessage,
  Placeholder,
  ValueContainer,
  DropdownIndicator,
  IndicatorSeparator,
  ClearIndicator
};

interface Props extends FieldLabelProps {
  placeholder: string;
  value?: CategoryOption;
  setValue: (category: CategoryOption) => void;
}

function isCategoryOption(x: any): x is CategoryOption {
  return x && x.label !== undefined;
}

const FieldLabelWithDropdowns = ({
  placeholder,
  value,
  setValue,
  ...fieldLabelProps
}: Props) => {
  const dropdownOptionsRef = useRef(
    getDropdownOptions(data as KeyedCategoryData)
  );

  return (
    <FieldLabel {...fieldLabelProps}>
      <Select
        components={customComponents}
        placeholder={placeholder}
        options={dropdownOptionsRef.current}
        filterOption={customFilterOption}
        onChange={(value: ValueType<CategoryOption>) => {
          if (isCategoryOption(value)) {
            setValue(value);
          }
        }}
        value={value}
        isClearable
      />
    </FieldLabel>
  );
};

export default FieldLabelWithDropdowns;
