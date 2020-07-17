import React from "react";
import Photo from "types/Photo";

interface Props {
  photo: Photo;
}

const Field = ({
  fieldName,
  value
}: {
  fieldName: string;
  value: string | React.ReactElement;
}) => {
  return (
    <div>
      <strong>{fieldName}</strong>: {value}
    </div>
  );
};

const PhotoFields = ({ photo }: Props) => {
  const {
    id,
    main,
    thumbnail,
    updated,
    moderated,
    owner_id,
    location,
    published,
    pieces,
    categories
  } = photo;
  return (
    <>
      <Field fieldName={"id"} value={id} />
      <Field fieldName={"owner"} value={owner_id} />
      <Field fieldName={"pieces"} value={String(pieces)} />
      <Field fieldName={"updated"} value={updated.toDateString()} />
      <Field
        fieldName={"moderated"}
        value={moderated ? moderated.toDateString() : "null"}
      />
      <Field
        fieldName={"location"}
        value={
          <a
            href={`https://www.google.com/maps/@${location.latitude},${location.longitude},18z`}
            target="_"
          >
            See Google Map
          </a>
        }
      />
      <Field fieldName={"published"} value={published ? "true" : "false"} />
      <Field
        fieldName={"thumbnail"}
        value={
          <a href={thumbnail} target="_">
            See Photo
          </a>
        }
      />
      <Field
        fieldName={"main"}
        value={
          <a href={main} target="_">
            See Photo
          </a>
        }
      />
      <Field
        fieldName={"categories"}
        value={
          <ul>
            {categories.map(({ number, label, brand }, idx) => (
              <li key={idx}>
                <Field
                  fieldName={"number"}
                  value={number ? String(number) : ""}
                />
                <Field fieldName={"label"} value={label || ""} />
                <Field fieldName={"brand"} value={brand || ""} />
              </li>
            ))}
          </ul>
        }
      />
    </>
  );
};

export default PhotoFields;
