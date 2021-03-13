import firebase from "firebase/app";

const firestore = firebase.firestore();

const categoriesPath = () => "categories";
const category = (categoryId: string) => `${categoriesPath()}/${categoryId}`;

export type ServerCategory = {
  label: string;
  synonyms?: string[];
};
export type Category = {
  id: string;
} & ServerCategory;

export const fetchCategories = async () => {
  const snap = await firestore.collection(categoriesPath()).get();

  return snap.docs.map((val) => ({ ...val.data(), id: val.id })) as Category[];
};

export async function addCategory(category: ServerCategory) {
  const res = await firestore.collection(categoriesPath()).add(category);

  return { id: res.id, ...category } as Category;
}

export async function addSynonyms(id: string, synonms: string[]) {
  await firestore.doc(category(id)).update({ synonms });
}
