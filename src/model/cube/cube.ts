import db from "../../db/db";

const addCube = async (idPerson: number, idCubeDropper: number) => {
  try {
    await db.cube.create({
      data: {
        scanned_at: new Date().toISOString(),
        id_person: idPerson,
        id_cube_dropper: idCubeDropper,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const markCubeAsReleased = async (idCube: number) => {
  try {
    await db.cube.update({
      data: {
        released_at: new Date().toISOString(),
      },
      where: {
        id: idCube,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getCubesByPerson = async (idPerson: number) => {
  let result = null;

  try {
    result = await db.cube.findMany({
      select: {
        id: true,
        cube_dropper: {
          select: {
            position: true,
            pickup_point: {
              select: {
                position: true,
              },
            },
          },
        },
      },
      where: {
        id_person: idPerson,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return result;
};

const cube = {
  add: addCube,
  markAsReleased: markCubeAsReleased,
  getByPerson: getCubesByPerson,
};

export default cube;
