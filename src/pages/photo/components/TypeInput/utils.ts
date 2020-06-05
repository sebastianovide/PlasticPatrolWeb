import _ from "lodash";
import categories from "custom/categories.json";

type Category = { key: string; label: string };
type CategoriesArr = Array<Category>;

export const categoriesArr: CategoriesArr = _.sortBy(
  Object.keys(categories).map((key) => {
    return {
      key,
      //@ts-ignore
      label: categories[key].label
    };
  }),
  ({ label }) => label
);

export function getSuggestions(input: string) {
  return categoriesArr.filter(filterCat(input));
}

function filterCat(input: string) {
  return function (category: Category) {
    if (input.length === 0) {
      return false;
    }
    const normalisedInput = input.toLowerCase();
    const normalisedCategory = category.label.toLowerCase();

    return normalisedCategory.includes(normalisedInput);
  };
}

export function getLeafKey(input: string) {
  if (input.length === 0) {
    return "none";
  }
  const normalisedInput = input.toLowerCase();

  const category = categoriesArr.find(
    ({ label }) => label.toLowerCase() === normalisedInput
  );

  if (category) {
    return category.key;
  }

  return null;
}
