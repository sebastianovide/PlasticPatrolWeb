import React, { createContext, useContext, useEffect, useState } from "react";

import orginal from "custom/categories.json";
import { fetchCategories, ServerCategory } from ".";

type CategoryJson = { [key: string]: ServerCategory };

export default function CategoriesProvider({ children }: any) {
  const [categories, setCategories] = useState<CategoryJson>(orginal);

  useEffect(() => {
    async function fetchAndReduce() {
      const categories = await fetchCategories();

      const json = categories.reduce((reduction, { id, ...rest }) => {
        reduction[id] = rest;

        return reduction;
      }, {} as CategoryJson);

      setCategories(json);
    }

    fetchAndReduce();
  }, []);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

const CategoryContext = createContext<CategoryJson>({});

export const useCategoriesJson = () => useContext(CategoryContext);
