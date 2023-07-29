import { CharacterData } from "./character";
import { SquadData } from "./squad";
import { WeaponData } from "./weapon";

export interface DatabaseData {
    characters: CharacterData[];
    squads: SquadData[];
    weapons: WeaponData[];

    selected?: number;
    selectedType?: "characters" | "squads" | "weapons";
}