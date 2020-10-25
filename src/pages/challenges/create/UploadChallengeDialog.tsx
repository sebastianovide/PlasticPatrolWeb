import React from "react";
import { ImageMetadata } from "../../../types/Photo";

interface Props {
  name: string;
  description: string;
  picture: ImageMetadata | undefined;
  startDate: Date | null;
  endDate: Date | null;
  targetPieces: number;
  onCancelUpload: () => void;
}

export default function UploadChallengeDialog({
  name,
  description,
  picture,
  startDate,
  endDate,
  targetPieces,
  onCancelUpload
}: Props) {
  // Upload challenge dialog
  // ...

  return <></>;
}
