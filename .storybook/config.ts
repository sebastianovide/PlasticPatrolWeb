import { configure, addDecorator } from "@storybook/react";
import StylesDecorator from "./StylesDecorator";

addDecorator(StylesDecorator);

// automatically import all files ending in *.stories.tsx
configure(require.context("../src", true, /\.stories\.tsx?$/), module);
