import axios from "axios";
import * as functions from "firebase-functions";
import { CallableContext } from "firebase-functions/lib/providers/https";

const doBarcodeLookup = async (id: number) => {
  const key = functions.config().barcode.lookup.key;
  const result = await axios.get(
    `https://api.barcodelookup.com/v2/products?barcode=${id}&formatted=y&key=${key}`
  );
  const data = result.data;
  if (data.products && data.products.length > 0) {
    const { brand, product_name: productName } = data.products[0];
    return { brand, productName };
  } else {
    throw new functions.https.HttpsError(
      "not-found",
      "no information was found for this barcode"
    );
  }
};

export const barcodeLookup = async (data: any, context: CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "permission denied"
    );
  }

  const id = parseInt(data.id);
  if (isNaN(id)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        'one arguments "id" containing the barcode id to lookup.'
    );
  }

  await doBarcodeLookup(data);
};
