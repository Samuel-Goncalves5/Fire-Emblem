import { useDatabase } from "./useDatabase";
import "./Modif.css"

function Modif() {
    const {database, updateDatabase, setSelected, getSelected} = useDatabase();

    const handleInputChange = (attribute: string, value: string | number | boolean) =>
    {
        if (getSelected())
        {
            const updatedSelected: any = { ...getSelected(), [attribute]: value };
            updateDatabase(updatedSelected);
        }
    };

    const handleImageChange = (attribute: string, value: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (getSelected())
        {
            const file = (value.target as HTMLInputElement).files?.[0];
  
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Image = e.target?.result as string;
                    handleInputChange(attribute, base64Image);
                };

                reader.readAsDataURL(file);
            }
        }
    }

    const isValid = () : boolean =>
    {
        if (database.selected === undefined || database.selectedType === undefined)
            return false;

        if ("character" in (database[database.selectedType][database.selected] as any))
            return !isNaN(
                (database[database.selectedType][database.selected] as any).vie +
                (database[database.selectedType][database.selected] as any).attaque +
                (database[database.selectedType][database.selected] as any).magie +
                (database[database.selectedType][database.selected] as any).technique +
                (database[database.selectedType][database.selected] as any).vitesse +
                (database[database.selectedType][database.selected] as any).chance +
                (database[database.selectedType][database.selected] as any).défense +
                (database[database.selectedType][database.selected] as any).charisme +
                (database[database.selectedType][database.selected] as any).résistance +
                (database[database.selectedType][database.selected] as any).mouvement
            );

        if ("weapon" in (database[database.selectedType][database.selected] as any))
            return !isNaN(
                (database[database.selectedType][database.selected] as any).dommages +
                (database[database.selectedType][database.selected] as any).critiques +
                (database[database.selectedType][database.selected] as any).poids +
                (database[database.selectedType][database.selected] as any).précision +
                (database[database.selectedType][database.selected] as any).durabilité
            );

        if ("squad" in (database[database.selectedType][database.selected] as any))
            return !isNaN(
                (database[database.selectedType][database.selected] as any).dégats +
                (database[database.selectedType][database.selected] as any).précision +
                (database[database.selectedType][database.selected] as any).tactique
            );

        return false;
    }

    if (database.selected !== undefined && database.selectedType !== undefined) {return (
    <div>
        <div className="table">
            <div className="etiquettes">
                {Object.keys(database[database.selectedType][database.selected]).map((attribute, index) => {
                    if (
                        attribute === "id" ||
                        database.selected === undefined ||
                        database.selectedType === undefined
                       )
                        return null;
                    if (
                        typeof (database[database.selectedType][database.selected] as any)[attribute] === "string" ||
                        typeof (database[database.selectedType][database.selected] as any)[attribute] === "number" ||
                        typeof (database[database.selectedType][database.selected] as any)[attribute] === "boolean"
                       )
                        return <div key={index}>{attribute}</div>;
                    
                    return null;
                }
                )}
            </div>
            <div className="inputs">
            {Object.keys(database[database.selectedType][database.selected]).map((attribute, index) => ((
                attribute === "id" || database.selected === undefined || database.selectedType === undefined ? null :
                (
                    attribute === "image" ?
                    (
                        <div key={index} className="image-div">
                            <label htmlFor="image" className="choix-image">
                                {"Cliquer ici pour changer d'image"}
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={(e) => handleImageChange(attribute, e)}
                                style={{display: 'none'}}
                            />
                        </div>
                    ) :
                    typeof (database[database.selectedType][database.selected] as any)[attribute] === "string" ?
                    (
                        <div key={index}>
                            <input
                                type="text"
                                defaultValue={(database[database.selectedType][database.selected] as any)[attribute]}
                                onChange={(e) => handleInputChange(attribute, e.target.value)}
                            />
                        </div>
                    ) : 
                    typeof (database[database.selectedType][database.selected] as any)[attribute] === "number" ?
                    (
                        <div key={index}>
                            <input
                                type="number"
                                defaultValue={(database[database.selectedType][database.selected] as any)[attribute]}
                                onChange={(e) => handleInputChange(attribute, parseInt(e.target.value))}
                            />
                        </div>
                    ) :
                    typeof (database[database.selectedType][database.selected]as any)[attribute] === "boolean" ?
                    (
                        <div key={index}>
                            <input
                                type="checkbox"
                                defaultChecked={(database[database.selectedType][database.selected] as any)[attribute]}
                                onChange={(e) => handleInputChange(attribute, e.target.checked)}
                            />
                        </div>
                    ) :
                    null
                )
            )))}
            </div>
            <div className="resume">
                {
                    ("character" in (database[database.selectedType][database.selected] as any)) ?
                        <>
                            <img src={(database[database.selectedType][database.selected] as any).image}/>
                            <div>
                                <strong>{(database[database.selectedType][database.selected] as any).nom}</strong>
                                <br/><br/>
                                <div className="stats">
                                    <div>HP: {(database[database.selectedType][database.selected] as any).vie}</div>
                                    <div>Frc: {(database[database.selectedType][database.selected] as any).attaque}</div>
                                    <div>Mag: {(database[database.selectedType][database.selected] as any).magie}</div>
                                    <div>Tec: {(database[database.selectedType][database.selected] as any).technique}</div>
                                    <div>Vit: {(database[database.selectedType][database.selected] as any).vitesse}</div>
                                    <div>Cha: {(database[database.selectedType][database.selected] as any).chance}</div>
                                    <div>Déf: {(database[database.selectedType][database.selected] as any).défense}</div>
                                    <div>Chm: {(database[database.selectedType][database.selected] as any).charisme}</div>
                                    <div>Rés: {(database[database.selectedType][database.selected] as any).résistance}</div>
                                    <div><strong>
                                        Total:{(database[database.selectedType][database.selected] as any).vie +
                                            (database[database.selectedType][database.selected] as any).attaque +
                                            (database[database.selectedType][database.selected] as any).magie +
                                            (database[database.selectedType][database.selected] as any).technique +
                                            (database[database.selectedType][database.selected] as any).vitesse +
                                            (database[database.selectedType][database.selected] as any).chance +
                                            (database[database.selectedType][database.selected] as any).défense +
                                            (database[database.selectedType][database.selected] as any).charisme +
                                            (database[database.selectedType][database.selected] as any).résistance}
                                    </strong></div>
                                </div>
                                <br/>
                                <div>Mvt: {(database[database.selectedType][database.selected] as any).mouvement}</div>
                            </div>
                        </>
                    : ("weapon" in (database[database.selectedType][database.selected] as any)) ?
                        <>
                            <img src={(database[database.selectedType][database.selected] as any).image}/>
                            <div>
                                <strong>{(database[database.selectedType][database.selected] as any).nom}</strong>
                                <br/><br/>
                                <div className="stats">
                                    <div>Dmg: {(database[database.selectedType][database.selected] as any).dommages}</div>
                                    <div>Cri: {(database[database.selectedType][database.selected] as any).critiques}</div>
                                    <div>Pds: {(database[database.selectedType][database.selected] as any).poids}</div>
                                    <div>Pré: {(database[database.selectedType][database.selected] as any).précision}</div>
                                    <div>Dur: {(database[database.selectedType][database.selected] as any).durabilité}</div>
                                </div>
                                <br/>
                                <div>{(database[database.selectedType][database.selected] as any)["magique?"] ? "Arme Magique" : ""}</div>
                            </div>
                        </>
                    : ("squad" in (database[database.selectedType][database.selected] as any)) ?
                        <>
                            <img src={(database[database.selectedType][database.selected] as any).image}/>
                            <div>
                                <strong>{(database[database.selectedType][database.selected] as any).nom}</strong>
                                <br/><br/>
                                <div className="stats">
                                    <div>Dég: {(database[database.selectedType][database.selected] as any).dégats}</div>
                                    <div>Pré: {(database[database.selectedType][database.selected] as any).précision}</div>
                                    <div>Tac: {(database[database.selectedType][database.selected] as any).tactique}</div>
                                </div>
                                <br/>
                                <div>{(database[database.selectedType][database.selected] as any)["magique?"] ? "Escouade Magique" : ""}</div>
                            </div>
                        </>
                    :
                        null
                }
            </div>
        </div>
        <div
          className="bouton-sauvegarder"
          id={isValid() ? "" : "error"}
          onClick={() => { if (isValid()) setSelected(); }}
        >
            Sauvegarder
        </div>
    </div>
    )} else return null;
}

export default Modif;