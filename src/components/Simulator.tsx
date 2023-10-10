import { useState } from "react";
import "./Simulator.css"
import { CharacterData } from "./interfaces/character";
import { SquadData } from "./interfaces/squad";
import { WeaponData } from "./interfaces/weapon";
import { useDatabase } from "./useDatabase";

function Select({className, database, undef, effect} : {className:string, database: CharacterData[] | WeaponData[] | SquadData[], effect:any[], undef:string}) {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (selectedValue === "") {
            effect[0](undefined);
        } else {
            const selectedItem = database[selectedValue as any];
            if (selectedItem) {
                for (let i = 0; i < effect.length; i++) {
                    effect[i](selectedItem);
                }
            }
        }
    };

    return (
        <select className={className} onChange={handleChange}>
            <option key={0} value=""> {undef} </option>
            {database.map((value, index) => <option key={index+1} value={value.id}> {value.nom} </option>)}
        </select>
    )
}

function Slider({max, valeur, setter} : {max:number, valeur:number, setter:any}) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) setter(newValue);
    }

    return <div className="Slider"><input type="range" min="1" max={max} value={valeur} onChange={handleChange}/></div>
}

function Simulator() {
    const {database} = useDatabase()

    const execSimulator = () => {
        // TODO
    }

    // Gauche
    const [character1, updateCharacter1] = useState<CharacterData | undefined>(undefined);
    const [weapon1, updateWeapon1] = useState<WeaponData | undefined>(undefined);
    const [squad1, updateSquad1] = useState<SquadData | undefined>(undefined);
    const [trueLife1, updateTrueLife1] = useState(1);

    // Droite
    const [character2, updateCharacter2] = useState<CharacterData | undefined>(undefined);
    const [weapon2, updateWeapon2] = useState<WeaponData | undefined>(undefined);
    const [squad2, updateSquad2] = useState<SquadData | undefined>(undefined);
    const [trueLife2, updateTrueLife2] = useState(1);

    return (
        <div id="simulateur">
            <div id="haut">
                <div id="gauche">
                    <div className="selects">
                        <Select className="characterSelect" database={database.characters} effect={[updateCharacter1, (c:CharacterData) => updateTrueLife1(c.vie)]} undef="<Personnage 1>"/>
                        <Select className="WeaponSelect" database={database.weapons} effect={[updateWeapon1]} undef="<Arme 1>"/>
                        <Select className="SquadSelect" database={database.squads} effect={[updateSquad1]} undef="<Escouade 1>"/>
                    </div>
                    {character1 ?
                    <div className="affichage">
                        <div className="image-affichage">
                            <img src={character1.image} alt=""/>
                        </div>
                        
                        <div className="stats">
                            <div>HP: {character1.vie}</div>
                            <div>Frc: {character1.attaque}</div>
                            <div>Mag: {character1.magie}</div>
                            <div>Tec: {character1.technique}</div>
                            <div>Vit: {character1.vitesse}</div>
                            <div>Cha: {character1.chance}</div>
                            <div>Déf: {character1.défense}</div>
                            <div>Chm: {character1.charisme}</div>
                            <div>Rés: {character1.résistance}</div>
                            <div><strong>
                                Total:{character1.vie +
                                    character1.attaque +
                                    character1.magie +
                                    character1.technique +
                                    character1.vitesse +
                                    character1.chance +
                                    character1.défense +
                                    character1.charisme +
                                    character1.résistance}
                            </strong></div>
                        </div>
                        
                        <div className="center">
                            <div className="true-life">
                                <div className="center"> Vie restante: </div>
                                <div className="center">
                                    <Slider max={character1.vie} valeur={trueLife1} setter={updateTrueLife1} />
                                </div>
                                <div className="center"> {trueLife1 > character1.vie ? character1.vie : trueLife1} / {character1.vie}</div>
                            </div>
                        </div>
                    </div> : null}
                </div>
                <div id="centre">
                    {character1 && character2 && weapon1 ?
                    <>
                        <div id="dégats">
                            <div className="center" id="name">Dégats</div>
                            <div className="center">
                                <div className="left">1</div>
                                <div className="middle"> vs </div>
                                <div className="right">2</div>
                            </div>
                        </div>
                        <div id="précision">
                            <div className="center" id="name">Précision</div>
                            <div className="center">
                                <div className="left">1</div>
                                <div className="middle"> vs </div>
                                <div className="right">2</div>
                            </div>
                        </div>
                        <div id="critique">
                            <div className="center" id="name">Critique</div>
                            <div className="center">
                                <div className="left">1</div>
                                <div className="middle"> vs </div>
                                <div className="right">2</div>
                            </div>
                        </div>
                    </> : null}
                </div>
                <div id="droite">
                    <div className="selects">
                        <Select className="characterSelect" database={database.characters} effect={[updateCharacter2, (c:CharacterData) => updateTrueLife2(c.vie)]} undef="<Personnage 2>"/>
                        <Select className="WeaponSelect" database={database.weapons} effect={[updateWeapon2]} undef="<Arme 2>"/>
                        <Select className="SquadSelect" database={database.squads} effect={[updateSquad2]} undef="<Escouade 2>"/>
                    </div>
                    {character2 ?
                    <div className="affichage">
                        <div className="image-affichage">
                            <img src={character2.image} alt=""/>
                        </div>
                        
                        <div className="stats">
                            <div>HP: {character2.vie}</div>
                            <div>Frc: {character2.attaque}</div>
                            <div>Mag: {character2.magie}</div>
                            <div>Tec: {character2.technique}</div>
                            <div>Vit: {character2.vitesse}</div>
                            <div>Cha: {character2.chance}</div>
                            <div>Déf: {character2.défense}</div>
                            <div>Chm: {character2.charisme}</div>
                            <div>Rés: {character2.résistance}</div>
                            <div><strong>
                                Total:{character2.vie +
                                    character2.attaque +
                                    character2.magie +
                                    character2.technique +
                                    character2.vitesse +
                                    character2.chance +
                                    character2.défense +
                                    character2.charisme +
                                    character2.résistance}
                            </strong></div>
                        </div>
                        
                        <div className="center">
                            <div className="true-life">
                                <div className="center"> Vie restante: </div>
                                <div className="center">
                                    <Slider max={character2.vie} valeur={trueLife2} setter={updateTrueLife2} />
                                </div>
                                <div className="center"> {trueLife2 > character2.vie ? character2.vie : trueLife2} / {character2.vie}</div>
                            </div>
                        </div>
                    </div> : null}
                </div>
            </div>
            {character1 && character2 && weapon1 ?
            <div id="bas">
                <div onClick={execSimulator} className='bouton-simulateur'>
                    Lancer la simulation
                </div>
            </div>
            : null}
        </div>
    );
}

export default Simulator;