import User from "../../entities/User";
import Clothes from "../../entities/Clothes";
import { filter, includes, map } from "lodash";

const getClothesListByUserId = async (id: number): Promise<any> => {
  const user = (await User.findOne(
    { id },
    {
      relations: ["clothes", "selectedClothes"],
    }
  )) as User;

  const clothes = user.clothes;
  const selectedClothes = user.selectedClothes;

  const result = clothes.map((c) => ({
    ...c,
    isSelected: includes(
      map(selectedClothes, (sc) => sc.id),
      c.id
    ),
  }));

  return result;
};

const addClothesItem = async (
  kakaoId: string,
  key: string
): Promise<{ id: number }> => {
  const user = (await User.findOne(
    { kakaoId },
    {
      relations: ["clothes", "selectedClothes"],
    }
  )) as User;

  const clothesToAdd = new Clothes();
  clothesToAdd.key = key;

  await clothesToAdd.save();

  user.clothes.push(clothesToAdd as Clothes);
  user.selectedClothes.push(clothesToAdd as Clothes);
  await user.save();

  return { id: clothesToAdd.id };
};

const saveClothesStatus = async (
  kakaoId: string,
  body: { key: string; isSelected: boolean; id: number }[]
): Promise<boolean> => {
  const user = (await User.findOne(
    { kakaoId },
    {
      relations: ["clothes", "selectedClothes"],
    }
  )) as User;

  const ids = map(body, (clothes) => clothes.id);

  const selectedIds = map(
    filter(body, (clothes) => clothes.isSelected),
    (body) => body.id
  );

  const selectedClothesList = await Clothes.findByIds(selectedIds);
  const clothesList = await Clothes.findByIds(ids);

  user.selectedClothes = selectedClothesList;
  user.clothes = clothesList;

  await user.save();

  return true;
};

const deleteClothesItem = async (
  kakaoId: string,
  id: number
): Promise<boolean> => {
  const user = (await User.findOne(
    { kakaoId },
    {
      relations: ["clothes", "selectedClothes"],
    }
  )) as User;

  const clothesToRemove = (await Clothes.findOne(id)) as Clothes;
  if (!clothesToRemove) return false;

  user.clothes = user.clothes.filter(
    (clothes) => clothes.id !== clothesToRemove.id
  );

  user.selectedClothes = user.selectedClothes.filter(
    (selectedClothes) => selectedClothes.id !== clothesToRemove.id
  );

  await user.save();
  return true;
};

export {
  getClothesListByUserId,
  addClothesItem,
  saveClothesStatus,
  deleteClothesItem,
};

// const deleteArtist = async (userId: number, artistId: number): Promise<boolean> => {
//   const user = (await User.findOne(userId, { relations: ['artists'] })) as User;
//   const artistToRemove = (await Artist.findOne(artistId)) as Artist;
//   if (!artistToRemove) return false;

//   user.artists = user.artists.filter(artist => artist.id !== artistToRemove.id);
//   await user.save();
//   return true;
// };
