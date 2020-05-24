// @ts-nocheck
import { sortArrayByObjectKey } from "utils";
import {
  CategoryData,
  CategoryOption,
  KeyedCategoryData
} from "types/Category";

export function customFilterOption(option, rawInput) {
  if (!rawInput) {
    return true;
  }

  const inputArr = rawInput
    .trim()
    .toLowerCase()
    .split(" ");
  const label = option && option.label && option.label.toLowerCase();

  if (!label) {
    return false;
  }

  return labelContainsAnyInputWord(inputArr, label);
}

function labelContainsAnyInputWord(inputArr, label) {
  return inputArr.reduce((acc, currentInputWord) => {
    return acc || labelWordContainsInputWord(label, currentInputWord);
  }, false);
}

export function labelWordContainsInputWord(label, input) {
  return label && label.includes(input);
}

export const getDropdownOptions = (
  categoriesObject: KeyedCategoryData
): CategoryOption[] => {
  const items: CategoryOption[] = [];

  function getNodesInLowestHierarchy(categoriesObject: KeyedCategoryData) {
    Object.entries(categoriesObject).forEach(([key, value]) => {
      if (!value.children) {
        items.push({ label: value.label, key: key });
      } else {
        getNodesInLowestHierarchy(value.children);
      }
    });
  }

  getNodesInLowestHierarchy(categoriesObject);

  return sortArrayByObjectKey(items, "label");
};
