import React, { useState, useCallback } from "react";
import classnames from "classnames";
import Button from "@material-ui/core/Button";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import CategoryField from "../../CategoryField";
import { FieldLabelWithInput } from "../../CategoryField/components/CategoryDropdown/FieldLabel";
import { validateIsPositiveNumber } from "../../CategoryField/components/validation";

import { Category } from "types/Category";

import "./Fields.scss";

type CategoryWithKey = {
  keyIndex: number;
  values: {
    error?: boolean;
  };
};

const INITIAL_CATEGORY_VALUES: CategoryWithKey[] = [
  { keyIndex: 0, values: { error: false } }
];

interface Props {
  imgSrc: any;
  handleChange: any;
  handleTotalCountChange: (error: boolean, totalCount: number) => void;
}

const Fields = ({ imgSrc, handleChange, handleTotalCountChange }: Props) => {
  const [categoryValues, setCategoryValues] = useState(INITIAL_CATEGORY_VALUES);
  const [childIndex, setNextChildIndex] = useState(categoryValues.length);
  const [totalCount, setTotalCount] = useState(0);
  const [anyCategoryErrors, setAnyCategoryErrors] = useState(false);
  const [totalCountErrors, setTotalCountErrors] = useState(true);
  const [photoEnlarged, setPhotoEnlarged] = useState(false);

  const handleSetTotalCount = (newTotalCount: string) => {
    const countError = !validateIsPositiveNumber(newTotalCount);

    setTotalCount(Number(newTotalCount));
    setTotalCountErrors(countError);
    handleTotalCountChange(
      countError || anyCategoryErrors,
      Number(newTotalCount)
    );
  };

  const handleClickAdd = (categoryValues: CategoryWithKey[]) => {
    categoryValues.push({ keyIndex: childIndex, values: {} });
    setNextChildIndex(childIndex + 1);
    setCategoryValues(categoryValues);
    setAnyCategoryErrors(true);
    handleChange(true, categoryValues);
  };

  const handleCategoryChange = (index: number) => (newValue: Category) => {
    let error = false;
    const updatedCategoryValues: CategoryWithKey[] = categoryValues.map(
      (categoryValue) => {
        const { keyIndex } = categoryValue;

        if (newValue.error) error = true;

        if (index === keyIndex) {
          return { keyIndex, values: newValue };
        }

        return categoryValue;
      }
    );

    setAnyCategoryErrors(error);
    handleChange(totalCountErrors || error, updatedCategoryValues);
    setCategoryValues(updatedCategoryValues);
  };

  const handleClickRemove = useCallback(
    (index) => () => {
      if (categoryValues.length <= 1) return;

      const filteredCategoryValues = categoryValues.filter(
        ({ keyIndex }) => index !== keyIndex
      );

      let anyErrors = false;
      filteredCategoryValues.forEach(({ values: { error } }) => {
        if (error) anyErrors = true;
      });

      setCategoryValues(filteredCategoryValues);
      setAnyCategoryErrors(anyErrors);
      handleChange(totalCountErrors || anyErrors, filteredCategoryValues);
    },
    [categoryValues, handleChange, totalCountErrors]
  );

  const imgRef = useOnOutsideClick(() => setPhotoEnlarged(false));

  return (
    <>
      <div className="Fields__container">
        <div className="Fields__pictureThumbnailContainer">
          <img
            src={imgSrc}
            alt={""}
            className={classnames("Fields__pictureThumbnail", {
              Fields__pictureThumbnailEnlarged: photoEnlarged
            })}
            ref={imgRef}
            onClick={() => setPhotoEnlarged(!photoEnlarged)}
          />
        </div>
        <FieldLabelWithInput
          label="Total number of pieces in photo:"
          placeholder="e.g. 0"
          value={"" + totalCount}
          setValue={handleSetTotalCount}
          validationFn={validateIsPositiveNumber}
          className="Fields__numberOfPieces"
        />
      </div>
      <div className="Fields__instruction">
        Identify each piece of rubbish in the photo
      </div>
      {categoryValues.map(({ keyIndex }) => {
        return (
          <div key={keyIndex} className="Fields__category">
            <CategoryField
              handleClickRemove={handleClickRemove(keyIndex)}
              handleChange={handleCategoryChange(keyIndex)}
            />
          </div>
        );
      })}
      <div className="Fields__button">
        <Button
          disabled={anyCategoryErrors}
          fullWidth
          variant="outlined"
          onClick={() => handleClickAdd(categoryValues)}
        >
          add another category
        </Button>
      </div>
    </>
  );
};

export default Fields;
