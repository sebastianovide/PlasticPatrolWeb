import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  Category,
  addCategory,
  addSynonyms
} from "features/firebase/categories";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchEm() {
      const fromServer = await fetchCategories();

      setCategories(
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
        <NewCategory categories={categories} setCategories={setCategories} />
        {categories.map((category) => (
          <CategoryRow {...category} key={category.id} />
        ))}
      </TableBody>
    </Table>
  );
}

function CategoryRow(category: Category) {
  const [newSynonyms, setNewSynonyms] = useState("");
  const [synonyms, setSynonyms] = useState<string[]>(category.synonyms || []);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {category.id}
      </TableCell>
      <TableCell>{category.label}</TableCell>
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
            await addSynonyms(category.id, updatedSynonyms);
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

function NewCategory({
  categories,
  setCategories
}: {
  categories: Category[];
  setCategories: any;
}) {
  const [label, setLabel] = useState("");
  const [synonyms, setSynonyms] = useState("");

  async function submit() {
    const sanitisedLabel = label.trim();

    if (sanitisedLabel.length === 0) {
      return;
    }

    // TODO: fuzzy match against existing categories to avoid duplicates

    const newCategory = await addCategory({
      label: sanitisedLabel,
      synonyms: sanitiseSynonyms(synonyms)
    });

    setCategories((old: any) => {
      return [...old, newCategory];
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
