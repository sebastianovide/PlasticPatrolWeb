import React, { useEffect, useState } from "react";
import {
  fetchBrands,
  Brand,
  addBrand,
  addSynonyms
} from "features/firebase/brands";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

export default function BrandsManagementPage() {
  const [categories, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function fetchEm() {
      const fromServer = await fetchBrands();

      setBrands(
        fromServer.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        })
      );
    }

    fetchEm();
  }, []);

  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Label</TableCell>
          <TableCell>Synonyms</TableCell>
          <TableCell>Add synonyms</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <Newbrand categories={categories} setBrands={setBrands} />
        {categories.map((brand) => (
          <BrandRow {...brand} key={brand.id} />
        ))}
      </TableBody>
    </Table>
  );
}

function BrandRow(brand: Brand) {
  const [newSynonyms, setNewSynonyms] = useState("");
  const [synonyms, setSynonyms] = useState<string[]>(brand.synonyms || []);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {brand.id}
      </TableCell>
      <TableCell>{brand.label}</TableCell>
      <TableCell>{synonyms.join(", ")}</TableCell>
      <TableCell>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const sanitized = sanitiseSynonyms(newSynonyms);
            if (sanitized.length === 0) {
              return;
            }

            const updatedSynonyms = [...synonyms, ...sanitized];
            await addSynonyms(brand.id, updatedSynonyms);
            setNewSynonyms("");
            setSynonyms(updatedSynonyms);
          }}
        >
          <input
            style={{ width: "100%" }}
            placeholder="comma separate different values"
            value={newSynonyms}
            onChange={(e) => setNewSynonyms(e.target.value)}
          />
          <Button type="submit">add</Button>
        </form>
      </TableCell>
    </TableRow>
  );
}

function Newbrand({
  categories,
  setBrands
}: {
  categories: Brand[];
  setBrands: any;
}) {
  const [label, setLabel] = useState("");
  const [synonyms, setSynonyms] = useState("");

  async function submit() {
    const sanitisedLabel = label.trim();

    if (sanitisedLabel.length === 0) {
      return;
    }

    // TODO: fuzzy match against existing categories to avoid duplicates

    const newbrand = await addBrand({
      label: sanitisedLabel,
      synonyms: sanitiseSynonyms(synonyms)
    });

    setBrands((old: any) => {
      return [...old, newbrand];
    });

    setLabel("");
    setSynonyms("");
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Button onClick={submit}>Add</Button>
      </TableCell>
      <TableCell>
        <input
          style={{ width: "100%" }}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <input
          style={{ width: "100%" }}
          placeholder="comma separate different values"
          value={synonyms}
          onChange={(e) => setSynonyms(e.target.value)}
        />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}

function sanitiseSynonyms(synonyms: string) {
  return synonyms.split(",").map((v) => v.trim());
}
