import { useState } from "react";

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
            image: "",

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
            image: "",
            
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
            image: "",

            dégats:0, précision:0, tactique:0,
            
            "magique?":false,
        })
    }

    return (
        <div className="base-de-donnee">
            <div className="personnages" onClick={() => {setValue([!value[0], value[1], value[2]])}}>
                Personnages
            </div>

            <ul className="personnages-list">
                {value[0] && database.characters.map((character, index) =>
                <li key={index}>
                    <div className="element">
                        <img src={character.image}/>
                        <div className="text">
                            <div className="nom">
                                {character.nom}
                                <br/><br/>
                                <strong>({character.vie + character.attaque + character.magie + character.technique + character.vitesse + character.chance + character.défense + character.charisme + character.résistance})</strong>
                            </div>
                        </div>
                        <div className="boutons">
                            <button className="modif" onClick={() => {setSelected(character.id, "characters")}}>
                                Modifier...
                            </button>
                            <br />
                            <button className="moins" onClick={() => {setSelected(); removeFromDatabase(character)}}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </li>
                )}
                {value[0] && <li className="ajout"><button className="ajout-bouton" onClick={() => addCharacter()}>+</button></li>}
            </ul>

            <div className="armes" onClick={() => {setValue([value[0], !value[1], value[2]])}}>
                Armes
            </div>

            <ul className="armes-list">
                {value[1] && database.weapons.map((weapon, index) =>
                <li key={index}>
                    <div className="element">
                        <img src={weapon.image}/>
                        <div className="text">
                            <div className="nom">
                                {weapon.nom}
                            </div>
                        </div>
                        <div className="boutons">
                            <button className="modif" onClick={() => {setSelected(weapon.id, "weapons")}}>
                                Modifier...
                            </button>
                            <br />
                            <button className="moins" onClick={() => {setSelected(); removeFromDatabase(weapon)}}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </li>
                )}
                {value[1] && <li className="ajout"><button className="ajout-bouton" onClick={() => addWeapon()}>+</button></li>}
            </ul>

            <div className="escouades" onClick={() => {setValue([value[0], value[1], !value[2]])}}>
                Escouades
            </div>

            <ul className="escouades-list">
                {value[2] && database.squads.map((squad, index) =>
                <li key={index}>
                    <div className="element">
                        <img src={squad.image}/>
                        <div className="text">
                            <div className="nom">
                                {squad.nom}
                            </div>
                        </div>
                        <div className="boutons">
                            <button className="modif" onClick={() => {setSelected(squad.id, "squads")}}>
                                Modifier...
                            </button>
                            <br />
                            <button className="moins" onClick={() => {setSelected(); removeFromDatabase(squad)}}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </li>
                )}
                {value[2] && <li className="ajout"><button className="ajout-bouton" onClick={() => addSquad()}>+</button></li>}
            </ul>
        </div>
    );
}

export default Database;