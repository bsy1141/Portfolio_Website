import { atom } from "recoil";

export const isAddingState = atom({
  key: "isAddingStatePortfolio",
  default: false,
});

export const pageState = atom({
  key: "pageStatePortfolio",
  default: 1,
});

export const allPageState = atom({
  key: "allPageStatePortfolio",
  default: 0,
});
