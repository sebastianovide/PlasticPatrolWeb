import _ from "lodash";

export type SuggestionT = {
  label: string;
  synonyms: string[];
  id: string;
};
type SuggestionArr = Array<SuggestionT>;

export function getSortedSuggestions(sourceData: Object): SuggestionArr {
  return _.sortBy(
    Object.keys(sourceData).map((id) => {
      // @ts-ignore
      const { label, synonyms = [] } = sourceData[id];

      return {
        label,
        synonyms,
        id
      };
    })
  );
}

export function getSuggestionsMatchingInput(
  sortedSuggestions: SuggestionArr,
  input: string
): SuggestionArr {
  return sortedSuggestions.filter(filterCat(input));
}

function filterCat(input: string): (category: SuggestionT) => boolean {
  return function (category: SuggestionT) {
    if (input.length === 0) {
      return false;
    }
    const normalisedInput = input.toLowerCase();
    const { label, synonyms } = category;
    const normalisedCategories = [label]
      .concat(synonyms || [])
      .map((x) => x.toLowerCase());

    return normalisedCategories.some((category) =>
      category.includes(normalisedInput)
    );
  };
}

export function getSuggestionId(
  sourceData: object,
  input: string
): string | null {
  if (input.length === 0) {
    return "none";
  }
  const normalisedInput = input.toLowerCase();

  const category = getSortedSuggestions(sourceData).find(
    ({ label }) => label.toLowerCase() === normalisedInput
  );

  if (category) {
    return category.id;
  }

  return null;
}
