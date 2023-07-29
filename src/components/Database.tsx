import { useState } from "react";
import Bouton from "./Bouton";

import './Database.css'
import { useDatabase } from "./useDatabase";

function Database() {

    const [value, setValue] = useState([true, true, true]);
    const {database, updateDatabase, removeFromDatabase, setSelected} = useDatabase();

    function addCharacter() {
        updateDatabase({
            id: database.characters.length,
            character: null,

            nom: "nom",

            vie:0, attaque:0, magie:0, technique:0,
            vitesse:0, chance:0, défense:0, charisme:0,
            résistance:0, mouvement:0,
        })
    }

    function addWeapon() {
        updateDatabase({
            id: database.weapons.length,
            weapon: null,

            nom: "arme",
            
            critiques:0, dommages:0, poids:0,
            précision:0, durabilité:0,
            
            "magique?":false,
        })
    }

    function addSquad() {
        updateDatabase({
            id: database.squads.length,
            squad: null,

            nom: "escouade",

            dégats:0, précision:0, tactique:0,
            
            "magique?":false,
        })
    }

    return (
        <>
            <br/><br/>
            
            <Bouton
                content="Personnages"
                onClick={() => {setValue([!value[0], value[1], value[2]])}}
            />

            {value[0] && database.characters.map((character, index) =>
            <div key={index}>
                {character.nom}
                <Bouton content="-" onClick={() => {setSelected(); removeFromDatabase(character)}}/>
                <Bouton content="✎" onClick={() => {setSelected(character.id, "characters")}}/>
            </div>
            )}
            {value[0] && <Bouton content="+" onClick={() => addCharacter()}/>}
            
            <br/><br/>
            
            <Bouton
                content="Armes"
                onClick={() => {setValue([value[0], !value[1], value[2]])}}
            />

            {value[1] && database.weapons.map((weapon, index) =>
            <div key={index}>
                {weapon.nom}
                <Bouton content="-" onClick={() => {setSelected(); removeFromDatabase(weapon)}}/>
                <Bouton content="✎" onClick={() => {setSelected(weapon.id, "weapons")}}/>
            </div>
            )}
            {value[1] && <Bouton content="+" onClick={() => addWeapon()}/>}

            <br/><br/>

            <Bouton
                content="Escouades"
                onClick={() => {setValue([value[0], value[1], !value[2]])}}
            />

            {value[2] && database.squads.map((squad, index) =>
            <div key={index}>
                {squad.nom}
                <Bouton content="-" onClick={() => {setSelected(); removeFromDatabase(squad)}}/>
                <Bouton content="✎" onClick={() => {setSelected(squad.id, "squads")}}/>
            </div>
            )}
            {value[2] && <Bouton content="+" onClick={() => addSquad()}/>}

            {JSON.stringify(database)}
        </>
    );
}

export default Database;