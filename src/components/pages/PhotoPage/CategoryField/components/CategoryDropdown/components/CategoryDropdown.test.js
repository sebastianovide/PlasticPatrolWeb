import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";

import CategoryDropdown from "./CategoryDropdown";

Enzyme.configure({ adapter: new Adapter() });

it("<CategoryDropdown />", () => {
  shallow(
    <CategoryDropdown
      label="Type of rubbish"
      placeholder={"e.g. plastic bottle"}
      value={""}
      setValue={() => {}}
    />
  );
});
