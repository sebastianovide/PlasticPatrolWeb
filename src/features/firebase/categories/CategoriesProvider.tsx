import React, { createContext, useContext, useEffect, useState } from "react";

import orginal from "custom/categories.json";
import { fetchCategories, ServerCategory } from ".";

import { useTranslation } from "react-i18next";
import { Plugins } from "@capacitor/core";

const { Device } = Plugins;

type CategoryJson = { [key: string]: ServerCategory };

export default function CategoriesProvider({ children }: any) {
  const [categories, setCategories] = useState<CategoryJson>(orginal);
  const { t } = useTranslation();

  useEffect(() => {
    async function getLocale() {
      const langCode = await Device.getLanguageCode();
      return await import(`locales/${langCode.value}.json`);
    }

    async function fetchAndReduce() {
      const locale = await getLocale(); // this is used to get the synonym for each language
      const categories = await fetchCategories();
      const json = categories.reduce((reduction, { id, label }) => {
        reduction[id] = {
          label: t(`categories.${label}.label`),
          synonyms: locale.default.translations.categories[label]?.synonyms
        };

        return reduction;
      }, {} as CategoryJson);

      setCategories(json);
    }

    fetchAndReduce();
  }, [t]);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

const CategoryContext = createContext<CategoryJson>({});

export const useCategoriesJson = () => useContext(CategoryContext);
