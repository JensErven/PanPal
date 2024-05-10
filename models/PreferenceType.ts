import { preferenceOption } from "./PreferenceOption";

export type preferenceType = {
  title: string;
  searchInputPlaceholder: string;
  addInputPlaceholder: string;
  options: preferenceOption[];
  selectedOptions: preferenceOption[];
};
