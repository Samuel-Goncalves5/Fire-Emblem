import React, { createContext, useState } from "react";
import { DatabaseData } from "./interfaces/databaseData";
import { CharacterData } from "./interfaces/character";
import { SquadData } from "./interfaces/squad";
import { WeaponData } from "./interfaces/weapon";
import { isCharacterDataValid, isDatabaseDataValid, isSquadDataValid, isWeaponDataValid } from "./interfaces/typeTest";

export interface DatabaseContextData {
    database: DatabaseData;
    updateDatabase: (update: CharacterData | SquadData | WeaponData | DatabaseData, add?: boolean) => void;
    removeFromDatabase: (remove: CharacterData | SquadData | WeaponData) => void;
    setSelected: (selected?: number, selectedType?: "characters" | "squads" | "weapons") => void;
    getSelected: () => CharacterData | SquadData | WeaponData | undefined;
}

export const DatabaseContext = createContext<DatabaseContextData>({
    database: {characters:[], weapons:[], squads:[]},
    updateDatabase: () => {},
    removeFromDatabase: () => {},
    setSelected: () => {},
    getSelected: () => undefined,
})

function DatabaseContextProvider({ children }: { children: React.ReactNode }) {
    const [database, setDatabase] = useState<DatabaseData>({
        characters:[],
        weapons:[],
        squads:[],
        selected:undefined,
        selectedType:undefined,
    });

    const updateDatabase = (update: CharacterData | SquadData | WeaponData | DatabaseData, add: boolean=false) => {
        const updateCharacter = (update: CharacterData) => {
            const characters = [...database.characters];
            const index = characters.findIndex((character) => character.id === update.id);

            if (index === -1)
                characters.push(update);
            else
                characters[index] = update;
            
            setDatabase({...database, characters});
        };

        const updateSquad = (update: SquadData) => {
            const squads = [...database.squads];
            const index = squads.findIndex((squad) => squad.id === update.id);

            if (index === -1)
                squads.push(update);
            else
                squads[index] = update;
            setDatabase({...database, squads});
        };

        const updateWeapon = (update: WeaponData) => {
            const weapons = [...database.weapons];
            const index = weapons.findIndex((weapon) => weapon.id === update.id);

            if (index === -1)
                weapons.push(update);
            else
                weapons[index] = update;
            setDatabase({...database, weapons});
        };


        if ("character" in update) {
            if (isCharacterDataValid(update))
                updateCharacter(update);
            else
                console.log("INVALD CHARACTER:", update);
        }
        else if ("squad" in update) {
            if (isSquadDataValid(update))
                updateSquad(update);
            else
                console.log("INVALD SQUAD:", update);
        }
        else if ("weapon" in update) {
            if (isWeaponDataValid(update))
                updateWeapon(update);
            else
                console.log("INVALD WEAPON:", update);
        }
        else if (isDatabaseDataValid(update))
        {
            if (add) {
                const characters = [...database.characters];
                const weapons = [...database.weapons];
                const squads = [...database.squads];

                const new_characters = [...update.characters];
                const new_weapons = [...update.weapons];
                const new_squads = [...update.squads];

                for (const new_character of new_characters) {
                    const index = characters.findIndex((character) => character.nom === new_character.nom);

                    if (index === -1) {
                        new_character.id = characters.length;
                        characters.push(new_character);
                    } else {
                        new_character.id = index;
                        characters[index] = new_character;
                    }
                }

                for (const new_weapon of new_weapons) {
                    const index = weapons.findIndex((weapon) => weapon.nom === new_weapon.nom);

                    if (index === -1) {
                        new_weapon.id = weapons.length;
                        weapons.push(new_weapon);
                    } else {
                        new_weapon.id = index;
                        weapons[index] = new_weapon;
                    }
                }

                for (const new_squad of new_squads) {
                    const index = squads.findIndex((squad) => squad.nom === new_squad.nom);

                    if (index === -1) {
                        new_squad.id = squads.length;
                        squads.push(new_squad);
                    } else {
                        new_squad.id = index;
                        squads[index] = new_squad;
                    }
                }

                setDatabase(
                    {characters:characters,
                     weapons:weapons,
                     squads:squads
                    });
            }
            else
                setDatabase({...update});
        }
        else
            console.log("INVALD DATABASE:", update);
    };

    const removeFromDatabase = (remove: CharacterData | SquadData | WeaponData) => {
        const removeCharacter = (remove: CharacterData) => {
            const characters = [...database.characters];
            
            setDatabase({
                characters: characters.filter((character) => character.id !== remove.id).map((character, index) => {return {...character, id: index}}),
                squads: database.squads,
                weapons: database.weapons
            });
        };

        const removeSquad = (remove: SquadData) => {
            const squads = [...database.squads];
            
            setDatabase({
                characters: database.characters,
                squads: squads.filter((squad) => squad.id !== remove.id).map((squad, index) => {return {...squad, id: index}}),
                weapons: database.weapons
            });
        };

        const removeWeapon = (remove: WeaponData) => {
            const weapons = [...database.weapons];
            
            setDatabase({
                characters: database.characters,
                squads: database.squads,
                weapons: weapons.filter((weapon) => weapon.id !== remove.id).map((weapon, index) => {return {...weapon, id: index}}),
            });
        };

        if ("character" in remove) {
            removeCharacter(remove);
        }
        else if ("squad" in remove) {
            removeSquad(remove);
        }
        else if ("weapon" in remove) {
            removeWeapon(remove);
        }
    }

    const setSelected = (selected?: number, selectedType?: "characters" | "squads" | "weapons") => {
        setDatabase({...database, selected, selectedType});
    }

    const getSelected = () => {
        return database.selectedType !== undefined && database.selected !== undefined ? database[database.selectedType][database.selected] : undefined;
    }

    return (
        <DatabaseContext.Provider value={{ database, updateDatabase, removeFromDatabase, setSelected, getSelected }}>
            {children}
        </DatabaseContext.Provider>
    );
}

export default DatabaseContextProvider;