import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchBrands, ServerBrand } from ".";

type BrandJson = { [key: string]: ServerBrand };

export default function BrandsProvider({ children }: any) {
  const [brands, setBrands] = useState({});

  useEffect(() => {
    async function fetchAndReduce() {
      const brands = await fetchBrands();

      const json = brands.reduce((reduction, { id, ...rest }) => {
        reduction[id] = rest;

        return reduction;
      }, {} as BrandJson);

      setBrands(json);
    }

    fetchAndReduce();
  }, []);

  return (
    <BrandContext.Provider value={brands}>{children}</BrandContext.Provider>
  );
}

const BrandContext = createContext<BrandJson>({});

export const useBrands = () => useContext(BrandContext);
