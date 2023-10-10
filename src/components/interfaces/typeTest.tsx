import { CharacterData } from "./character";
import { SquadData } from "./squad";
import { WeaponData } from "./weapon";
import { DatabaseData } from "./databaseData";

export function isCharacterDataValid(data: any): data is CharacterData {
  const expectedKeys = [
    'id',
    'character',
    'nom',
    'image',
    'vie',
    'attaque',
    'magie',
    'technique',
    'vitesse',
    'chance',
    'défense',
    'résistance',
    'charisme',
    'mouvement',
  ];
  
  // console.log(typeof data === 'object');
  // console.log(data !== null);
  // console.log(expectedKeys.every(key => key in data));
  // console.log(Object.keys(data).every(key => {console.log(key, expectedKeys.includes(key)); return expectedKeys.includes(key)}));

  return (
    typeof data === 'object' &&
    data !== null &&
    expectedKeys.every(key => key in data) && // Vérifie si toutes les propriétés attendues sont présentes
    Object.keys(data).every(key => expectedKeys.includes(key)) // Vérifie s'il n'y a pas de propriétés inattendues
  );
}
  
export function isSquadDataValid(data: any): data is SquadData {
  const expectedKeys = [
    'id',
    'squad',
    'nom',
    'image',
    'dégats',
    'précision',
    'tactique',
    'magique?',
  ];

  // console.log(typeof data === 'object');
  // console.log(data !== null);
  // console.log(expectedKeys.every(key => key in data));
  // console.log(Object.keys(data).every(key => {console.log(key, expectedKeys.includes(key)); return expectedKeys.includes(key)}));

  return (
    typeof data === 'object' &&
    data !== null &&
    expectedKeys.every(key => key in data) && // Vérifie si toutes les propriétés attendues sont présentes
    Object.keys(data).every(key => expectedKeys.includes(key)) // Vérifie s'il n'y a pas de propriétés inattendues
  );
}

export function isWeaponDataValid(data: any): data is WeaponData {
  const expectedKeys = [
    'id',
    'weapon',
    'nom',
    'image',
    'dommages',
    'critiques',
    'poids',
    'précision',
    'durabilité',
    'magique?',
  ];

  // console.log(typeof data === 'object');
  // console.log(data !== null);
  // console.log(expectedKeys.every(key => key in data));
  // console.log(Object.keys(data).every(key => {console.log(key, expectedKeys.includes(key)); return expectedKeys.includes(key)}));

  return (
    typeof data === 'object' &&
    data !== null &&
    expectedKeys.every(key => key in data) && // Vérifie si toutes les propriétés attendues sont présentes
    Object.keys(data).every(key => expectedKeys.includes(key)) // Vérifie s'il n'y a pas de propriétés inattendues
  );
}

export function isDatabaseDataValid(data: any): data is DatabaseData {
  const expectedKeys = [
    'characters',
    'squads',
    'weapons',
  ];

  const optionalKeys = [
    'selected',
    'selectedType',
  ]

  // console.log(typeof data === 'object');
  // console.log(data !== null);
  // console.log(expectedKeys.every(key => key in data));
  // console.log(Object.keys(data).every(key => {console.log(key, expectedKeys.includes(key) || optionalKeys.includes(key)); return expectedKeys.includes(key) || optionalKeys.includes(key)}));
  // console.log(Array.isArray(data.characters));
  // console.log(Array.isArray(data.squads));
  // console.log(Array.isArray(data.weapons));
  // console.log((data.selected === undefined || typeof data.selected === 'number'));
  // console.log((data.selectedType === undefined || (data.selectedType === 'characters' || data.selectedType === 'squads' || data.selectedType === 'weapons')));
  // console.log(data.characters.every(isCharacterDataValid));
  // console.log(data.squads.every(isSquadDataValid));
  // console.log(data.weapons.every(isWeaponDataValid));

  if (
    typeof data === 'object' &&
    data !== null &&
    expectedKeys.every(key => key in data) && // Vérifie si toutes les propriétés attendues sont présentes
    Object.keys(data).every(key => expectedKeys.includes(key) || optionalKeys.includes(key)) && // Vérifie s'il n'y a pas de propriétés inattendues
    Array.isArray(data.characters) &&
    Array.isArray(data.squads) &&
    Array.isArray(data.weapons) &&
    (data.selected === undefined || typeof data.selected === 'number') &&
    (data.selectedType === undefined || (data.selectedType === 'characters' || data.selectedType === 'squads' || data.selectedType === 'weapons'))
  ) {
    // Valider chaque élément dans les tableaux characters, squads et weapons
    const characterValid = data.characters.every(isCharacterDataValid);
    const squadValid = data.squads.every(isSquadDataValid);
    const weaponValid = data.weapons.every(isWeaponDataValid);

    return characterValid && squadValid && weaponValid;
  }

  return false;
}