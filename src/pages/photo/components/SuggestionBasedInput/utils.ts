import _ from "lodash";

type Suggestion = { key: string; label: string; synonyms?: string[] };
type SuggestionArr = Array<Suggestion>;

export function getSortedSuggestions(sourceData: Object) {
  return _.sortBy(
    Object.keys(sourceData).map((key) => {
      return {
        key,
        //@ts-ignore
        label: sourceData[key].label,
        //@ts-ignore
        synonyms: sourceData[key].synonyms
      };
    }),
    ({ label }) => label
  );
}

const any = (bools: boolean[]): boolean => {
  return !bools.map((b) => !b).every((x) => x);
};

export function getSuggestions(sourceData: object, input: string) {
  return getSortedSuggestions(sourceData).filter(filterCat(input));
}

function filterCat(input: string) {
  return function (category: Suggestion) {
    if (input.length === 0) {
      return false;
    }
    const normalisedInput = input.toLowerCase();
    const { label, synonyms } = category;
    const normalisedCategories = [label]
      .concat(synonyms || [])
      .map((x) => x.toLowerCase());

    return any(
      normalisedCategories.map((normalisedCategory) =>
        normalisedCategory.includes(normalisedInput)
      )
    );
  };
}

export function getLeafKey(sourceData: object, input: string) {
  if (input.length === 0) {
    return "none";
  }
  const normalisedInput = input.toLowerCase();

  const category = getSortedSuggestions(sourceData).find(
    ({ label }) => label.toLowerCase() === normalisedInput
  );

  if (category) {
    return category.key;
  }

  return null;
}
