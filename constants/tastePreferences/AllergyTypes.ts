// Used for the dropdown list of allergy types in the AddAllergy component
// Contains the list of allergy types that can be selected by the user
// Each allergy type has an id and a name and can never be changed
const allergyTypes: string[] = Array.from(
  new Set([
    "Gluten",
    "Dairy",
    "Egg",
    "Soy",
    "Shellfish",
    "Peanut",
    "Tree nut",
    "Fish",
    "Sesame",
    "Mustard",
    "Celery",
    "Sulfites",
    "Lupin",
    "Crustacean Shellfish",
    "Wheat",
    "Cereals w/ Gluten",
    "Buckwheat",
    "Celery",
    "Lupin",
    "Molluscan Shellfish",
    "Mustard",
    "Sesame",
    "Bee Pollen/ Propolis",
    "Beef",
    "Chicken",
    "Latex (Natural Rubber)",
    "Mango",
    "Peach",
    "Pork",
    "Royal Jelly",
    "Tomato",
  ])
);

export { allergyTypes };
