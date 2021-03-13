import firebase from "firebase/app";

const firestore = firebase.firestore();

const brandsPath = () => "brands";
const brand = (brandId: string) => `${brandsPath()}/${brandId}`;

export type ServerBrand = {
  label: string;
  synonyms?: string[];
};
export type Brand = {
  id: string;
} & ServerBrand;

export const fetchBrands = async () => {
  const snap = await firestore.collection(brandsPath()).get();

  return snap.docs.map((val) => ({
    ...val.data(),
    id: val.id
  })) as Brand[];
};

export async function addBrand(brand: ServerBrand) {
  const res = await firestore.collection(brandsPath()).add(brand);

  return { id: res.id, ...brand } as Brand;
}

export async function addSynonyms(id: string, synonms: string[]) {
  await firestore.doc(brand(id)).update({ synonms });
}
