import _ from "lodash";

type Suggestion = { key: string; label: string; synonyms?: string[] };
type SuggestionArr = Array<Suggestion>;

export function getSortedSuggestions(sourceData: Object): SuggestionArr {
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

export function getSuggestionsMatchingInput(sortedSuggestions: SuggestionArr, input: string): SuggestionArr {
  return sortedSuggestions.filter(filterCat(input));
}

function filterCat(input: string): (category: Suggestion) => boolean {
  return function (category: Suggestion) {
    if (input.length === 0) {
      return false;
    }
    const normalisedInput = input.toLowerCase();
    const { label, synonyms } = category;
    const normalisedCategories = [label]
      .concat(synonyms || [])
      .map((x) => x.toLowerCase());

    return normalisedCategories
      .map(category => category.includes(normalisedInput))
      .includes(true);
  };
}

export function getLeafKey(sourceData: object, input: string): string | null {
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
