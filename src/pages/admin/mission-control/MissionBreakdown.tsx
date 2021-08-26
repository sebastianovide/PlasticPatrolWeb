import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { dbFirebase } from "features/firebase";
import { useMissions } from "providers/MissionsProvider";
import { useEffect, useState } from "react";
import { Mission } from "types/Missions";
import Photo from "types/Photo";

import { flattenPhotosForCsv, getCsv } from "./utils";

export default function MissionBreakdown({ missionId }: { missionId: string }) {
  const missions = useMissions();

  const [mission, setMission] = useState<Mission>();

  useEffect(() => {
    const missionList = missions?.missions || [];

    const mission = missionList.find(({ id }) => id === missionId);

    setMission(mission);
  }, [missions?.missions]);

  if (mission) {
    return <_MissionBreakdown {...mission} />;
  }

  return <div>No mission matches given id (may be loading...)</div>;
}

function _MissionBreakdown({
  name,
  startTime,
  endTime,
  totalUserPieces,
  isPrivate,
  pendingPieces,
  totalPieces,
  targetPieces,
  id
}: Mission) {
  const userIds = Object.keys(totalUserPieces);

  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchP() {
      const photos = await dbFirebase.fetchPhotos();

      const filtered = photos.filter(({ missions = [] }) =>
        missions.includes(id)
      );

      setPhotos(filtered);
    }

    fetchP();
  }, []);

  return (
    <>
      <div>
        <h2>Mission Info</h2>
        <div>Name: {name}</div>
        <div>Start date: {new Date(startTime).toDateString()}</div>
        <div>End date: {new Date(endTime).toDateString()}</div>
        <div>
          Is active:{" "}
          {String(
            new Date() > new Date(startTime) && new Date() < new Date(endTime)
          )}
        </div>
        <div>Is private: {String(isPrivate)}</div>
        <div>Pending pieces: {pendingPieces}</div>
        <div>Total pieces: {totalPieces}</div>
        <div>Target pieces: {targetPieces}</div>
      </div>

      <button
        onClick={() => {
          const { data, headers } = flattenPhotosForCsv(photos);
          getCsv(data, headers, `${name}-photos.csv`);
        }}
      >
        Download photo data
      </button>
      <button
        onClick={() => {
          getCsv(
            userIds.map((id) => {
              const { displayName, pieces, uid } = totalUserPieces[id];
              return [displayName, pieces, uid];
            }),
            ["Display name", "Pieces", "UserId"],
            `${name}-users.csv`
          );
        }}
      >
        Download user data
      </button>

      <h2>Users</h2>
      <UserTable totalUserPieces={totalUserPieces} />

      <PhotosAggregations photos={photos} />
    </>
  );
}

function UserTable({ totalUserPieces }: any) {
  const userIds = Object.keys(totalUserPieces);

  // TODO: get emails - will need a firebase function to make use of admin sdk for lookup

  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Display name</TableCell>
          <TableCell>Pieces</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userIds.map((id) => {
          const { displayName, pieces } = totalUserPieces[id];
          return (
            <TableRow>
              <TableCell component="th" scope="row">
                {displayName}
              </TableCell>

              <TableCell>{pieces}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function PhotosAggregations({ photos }: { photos: any[] }) {
  return (
    <>
      <h2>Photos</h2>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>UserId</TableCell>
            <TableCell>PhotoId</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Number of pieces</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Brands</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {photos.map(
            ({ id, owner_id, published, pieces, categories, ...rest }) => {
              // @ts-ignore
              const { brands, types } = categories.reduce(
                // @ts-ignore
                ({ brands, types }, cat) => {
                  return {
                    // @ts-ignore
                    brands: [...brands, cat.brand],
                    // @ts-ignore
                    types: [...types, cat.label]
                  };
                },
                { brands: [], types: [] }
              );
              return (
                <TableRow key={id}>
                  <TableCell>{owner_id}</TableCell>
                  <TableCell>{id}</TableCell>
                  <TableCell>{String(published)}</TableCell>
                  <TableCell>{pieces}</TableCell>
                  <TableCell>{types.join(",")}</TableCell>
                  <TableCell>{brands.join(",")}</TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </>
  );
}
