import db from "../../db/db";

export const addCube = (idPerson: number, idCubeDropper: number) => {
  db.cube.create({
    data: {
      scanned_at: Date.now.toString(),
      id_person: idPerson,
      id_cube_dropper: idCubeDropper,
    },
  });
};

export const markCubeAsReleased = (idCube: number) => {
  db.cube.update({
    data: {
      released_at: Date.now.toString(),
    },
    where: {
      id: idCube,
    },
  });
};
