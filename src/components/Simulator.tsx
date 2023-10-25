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
            for (let i = 0; i < effect.length; i++) {
                effect[i](undefined);
            }
        } else {
            const selectedItem = database[selectedValue as any];
            for (let i = 0; i < effect.length; i++) {
                effect[i](selectedItem);
            }
        }
    };

    const sortedDatabase = database.slice().sort((a, b) => a.nom.localeCompare(b.nom));

    return (
        <select className={className} onChange={handleChange}>
            <option key={0} value=""> {undef} </option>
            {sortedDatabase.map((value, index) => <option key={index+1} value={value.id}> {value.nom} </option>)}
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
    
    const [squadMode, updateSquadMode] = useState(false);
    const [simulatorLogs, updateSimulatorLogs] = useState<{roll: number; attaquant: number; état: string; dégats: number; vie1: number; vie2: number}[] | undefined>(undefined)

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

    // Prévision
    const prévision = {
        left: {
            offensif: {
                type: {
                    physique: 0,
                    magique: 0
                },
                dégats: 0,
                précision: 0,
                critique: 0
            },

            escouades: {
                type: {
                    physique: 0,
                    magique: 0
                },

                attaque: 0,
                précision: 0
            },

            autres: {
                soin: 0,
                vitesseRéelle: 0,
                esquive: 0,
                nombreAttaques: 0,
            }
        },

        right: {
            offensif: {
                type: {
                    physique: 0,
                    magique: 0
                },
                dégats: 0,
                précision: 0,
                critique: 0
            },

            autres: {
                vitesseRéelle: 0,
                esquive: 0,
                nombreAttaques: 0,
            }
        }
    };

    const calculPrévision = () => {
        if (!character1 || !character2 || !weapon1) return;

        // ##############
        // ### DEGATS ###
        // ##############
        prévision.left.offensif.type.physique =
            Math.max(character1.attaque - character2.défense + weapon1.dommages, 0);
        prévision.left.offensif.type.magique =
            Math.max(character1.magie - character2.résistance + weapon1.dommages, 0);
        prévision.left.offensif.dégats =
            weapon1["magique?"] ? prévision.left.offensif.type.magique : prévision.left.offensif.type.physique;
        
        if (!weapon2)
        {
            prévision.right.offensif.type.physique = 0;
            prévision.right.offensif.type.magique = 0;
            prévision.right.offensif.dégats = 0;
        }
        else
        {
            prévision.right.offensif.type.physique =
                Math.max(character2.attaque - character1.défense + weapon2.dommages, 0);
            prévision.right.offensif.type.magique =
                Math.max(character2.magie - character1.résistance + weapon2.dommages, 0);
            prévision.right.offensif.dégats =
                weapon2["magique?"] ? prévision.right.offensif.type.magique : prévision.right.offensif.type.physique;
        }

        // ######################
        // ### VITESSE REELLE ###
        // ######################
        prévision.left.autres.vitesseRéelle = Math.min(character1.vitesse, character1.vitesse + Math.floor(character1.attaque / 5) - weapon1.poids);
        if (!weapon2)
            prévision.right.autres.vitesseRéelle = character2.vitesse;
        else
            prévision.right.autres.vitesseRéelle = Math.min(character2.vitesse, character2.vitesse + Math.floor(character2.attaque / 5) - weapon2.poids);

        const diff = prévision.left.autres.vitesseRéelle - prévision.right.autres.vitesseRéelle;
        if (diff >= 4)
        {
            prévision.left.autres.nombreAttaques = 2;
            prévision.right.autres.nombreAttaques = 1;
        }
        else if (diff <= -4)
        {
            prévision.left.autres.nombreAttaques = 1;
            prévision.right.autres.nombreAttaques = 2;
        }
        else
        {
            prévision.left.autres.nombreAttaques = 1;
            prévision.right.autres.nombreAttaques = 1;
        }

        // ###############
        // ### ESQUIVE ###
        // ###############
        prévision.left.autres.esquive = prévision.left.autres.vitesseRéelle;
        prévision.right.autres.esquive = prévision.right.autres.vitesseRéelle;

        // #################
        // ### PRECISION ###
        // #################
        prévision.left.offensif.précision = Math.min(Math.max(weapon1.précision + character1.technique - prévision.right.autres.esquive, 0), 100);
        if (!weapon2)
            prévision.right.offensif.précision = 0;
        else
            prévision.right.offensif.précision = Math.min(Math.max(weapon2.précision + character2.technique - prévision.left.autres.esquive, 0), 100);

        // ################
        // ### CRITIQUE ###
        // ################
        prévision.left.offensif.critique = Math.max(weapon1.critiques + Math.floor((character1.technique + character1.chance)/2) - character2.chance, 0);
        if (!weapon2)
            prévision.right.offensif.critique = 0;
        else
            prévision.right.offensif.critique = Math.max(weapon2.critiques + Math.floor((character2.technique + character2.chance)/2) - character1.chance, 0);

        // ############
        // ### SOIN ###
        // ############
        prévision.left.autres.soin = weapon1.dommages + Math.floor(character1.magie / 4);

        // #################
        // ### ESCOUADES ###
        // #################
        if (!squad1)
        {
            prévision.left.escouades.type.physique = 0;
            prévision.left.escouades.type.magique = 0;
            prévision.left.escouades.attaque = 0;
            prévision.left.escouades.précision = 0;
        }
        else
        {
            prévision.left.escouades.type.physique = squad1.dégats + character1.attaque - character2.défense + 4 + Math.max(Math.min(Math.floor(character1.charisme / 5), 30), -30);
            prévision.left.escouades.type.magique = squad1.dégats + character1.magie - character2.résistance + 4 + Math.max(Math.min(Math.floor(character1.charisme / 5), 30), -30);
            prévision.left.escouades.attaque =
                squad1["magique?"] ? prévision.left.escouades.type.magique : prévision.left.escouades.type.physique;
            prévision.left.escouades.précision = Math.min(Math.max(squad1.précision + 5 * (character1.charisme - character2.charisme) + 10, 0), 100);
        }
    }

    calculPrévision();

    // Simulation
    const execSimulator = () => {
        var nombreLeft = prévision.left.autres.nombreAttaques;
        var nombreRight = prévision.right.autres.nombreAttaques;

        var hit1;
        var hit2;
        var trueHit;

        var vie1 = trueLife1;
        var vie2 = trueLife2;

        const logs = [];

        if (squadMode)
        {
            hit1 = Math.floor(Math.random() * 100);
            hit2 = Math.floor(Math.random() * 100);
            trueHit = Math.floor((hit1 + hit2) / 2);

            if (trueHit >= prévision.left.escouades.précision)
                logs.push({
                    roll: trueHit,
                    attaquant: 1,
                    état: "échec",
                    dégats: 0,
                    vie1,
                    vie2
            });
            else
            {
                vie2 -= Math.min(prévision.left.escouades.attaque, vie2);
                logs.push({
                    roll: trueHit,
                    attaquant: 1,
                    état: "attaque",
                    dégats: prévision.left.escouades.attaque,
                    vie1,
                    vie2
                });
            }

            return logs;
        }

        while (nombreLeft > 0 || nombreRight > 0)
        {
            if (nombreLeft > 0)
            {
                hit1 = Math.floor(Math.random() * 100);
                hit2 = Math.floor(Math.random() * 100);
                trueHit = Math.floor((hit1 + hit2) / 2);

                if (trueHit >= prévision.left.offensif.précision)
                    logs.push({
                        roll: trueHit,
                        attaquant: 1,
                        état: "échec",
                        dégats: 0,
                        vie1,
                        vie2
                    });
                else if (trueHit < prévision.left.offensif.critique)
                {
                    vie2 -= Math.min(prévision.left.offensif.dégats * 3, vie2);
                    logs.push({
                        roll: trueHit,
                        attaquant: 1,
                        état: "critique",
                        dégats: prévision.left.offensif.dégats * 3,
                        vie1,
                        vie2
                    });
                }
                else
                {
                    vie2 -= Math.min(prévision.left.offensif.dégats, vie2);
                    logs.push({
                        roll: trueHit,
                        attaquant: 1,
                        état: "attaque",
                        dégats: prévision.left.offensif.dégats,
                        vie1,
                        vie2
                    });
                }
                nombreLeft--;
            }

            if (vie2 === 0) return logs;

            if (nombreRight > 0)
            {
                hit1 = Math.floor(Math.random() * 100);
                hit2 = Math.floor(Math.random() * 100);
                trueHit = Math.floor((hit1 + hit2) / 2);

                if (trueHit >= prévision.right.offensif.précision)
                    logs.push({
                        roll: trueHit,
                        attaquant: 2,
                        état: "échec",
                        dégats: 0,
                        vie1,
                        vie2
                    });
                else if (trueHit < prévision.right.offensif.critique)
                {
                    vie1 -= Math.min(prévision.right.offensif.dégats * 3, vie1);
                    logs.push({
                        roll: trueHit,
                        attaquant: 2,
                        état: "critique",
                        dégats: prévision.right.offensif.dégats * 3,
                        vie1,
                        vie2
                    });
                }
                else
                {
                    vie1 -= Math.min(prévision.right.offensif.dégats, vie1);
                    logs.push({
                        roll: trueHit,
                        attaquant: 2,
                        état: "attaque",
                        dégats: prévision.right.offensif.dégats,
                        vie1,
                        vie2
                    });
                }
                nombreRight--;
            }

            if (vie1 === 0) return logs;
        }

        return logs;
    }
    
    const attaquant = (i:number) => i === 1 ? character1?.nom : character2?.nom;
    const defenseur = (i:number) => i === 2 ? character1?.nom : character2?.nom;

    const log = (value: {roll: number; attaquant: number; état: string; dégats: number; vie1: number; vie2: number}) => {
        var message = "(" + value.roll + ") - ";
        if (value.état === "échec") message += "Echec ! ";
        else if (value.état === "critique") message += "Critique ! ";
        message += attaquant(value.attaquant) + " attaque " + defenseur(value.attaquant);
        if (value.état === "échec") message += ", qui esquive";
        else message += " et inflige " + value.dégats;
        message += ". Il reste " + (value.attaquant === 1 ? value.vie2 : value.vie1) + "pv à " + defenseur(value.attaquant) + ".";

        return message;
    }

    return (
        <div id="simulateur">
            <div id="haut">
                <div id="gauche">
                    <div className="selects">
                        <Select className="characterSelect" database={database.characters} effect={[updateCharacter1, (c:CharacterData|undefined) => c ? updateTrueLife1(c.vie) : null]} undef="<Personnage 1>"/>
                        <Select className="WeaponSelect" database={database.weapons} effect={[updateWeapon1]} undef="<Arme 1>"/>
                        <Select className="SquadSelect" database={database.squads} effect={[updateSquad1, (s:SquadData|undefined) => s ? null : updateSquadMode(false)]} undef="<Escouade 1>"/>
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
                                <div className="center"> {trueLife1} / {character1.vie}</div>
                            </div>
                        </div>
                    </div> : null}
                </div>
                <div id="centre">
                    {character1 && character2 && weapon1 ?
                    <>
                        <div id="mode">
                            <img className={squadMode ? "not-selected" : "selected"} onClick={() => updateSquadMode(false)} src={weapon1.image}/>
                            {squad1 ?
                            <img className={squadMode ? "selected" : "not-selected"} onClick={() => updateSquadMode(true )} src={squad1.image }/>
                            : null}
                        </div>
                        <div id="dégats">
                            <div className="center" id="name">Dégats</div>
                            <div className="center">
                                <div className="left">{squadMode ? prévision.left.escouades.attaque : prévision.left.offensif.dégats}</div>
                                <div className="middle"> vs </div>
                                <div className="right">{squadMode ? 0 : prévision.right.offensif.dégats}</div>
                            </div>
                            { !squadMode ?
                            <div className="center">
                                <div className="left">x {prévision.left.autres.nombreAttaques}</div>
                                <div className="middle"></div>
                                <div className="right">x {prévision.right.autres.nombreAttaques}</div>
                            </div> : null}
                        </div>
                        <div id="précision">
                            <div className="center" id="name">Précision</div>
                            <div className="center">
                                <div className="left">{squadMode ? prévision.left.escouades.précision : prévision.left.offensif.précision}</div>
                                <div className="middle"> vs </div>
                                <div className="right">{squadMode ? 0 : prévision.right.offensif.précision}</div>
                            </div>
                        </div>
                        { !squadMode ?
                        <div id="critique">
                            <div className="center" id="name">Critique</div>
                            <div className="center">
                                <div className="left">{squadMode ? 0 : prévision.left.offensif.critique}</div>
                                <div className="middle"> vs </div>
                                <div className="right">{squadMode ? 0 : prévision.right.offensif.critique}</div>
                            </div>
                        </div> : null}
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
                                <div className="center"> {trueLife2} / {character2.vie}</div>
                            </div>
                        </div>
                    </div> : null}
                </div>
            </div>
            {character1 && character2 && weapon1 ?
            <div id="bas">
                <div onClick={() => updateSimulatorLogs(execSimulator())} className='bouton-simulateur'>
                    Lancer la simulation
                </div>
                {simulatorLogs ?
                <div id="logs">
                    {simulatorLogs.map((value, index) => <div key={index} className={value.état}>{log(value)}</div>)}
                </div> : null}
            </div>
            : null}
        </div>
    );
}

export default Simulator;