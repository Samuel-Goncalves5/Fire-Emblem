import Bouton from "./Bouton";
import { useDatabase } from "./useDatabase";

function Modif() {
    const {database, updateDatabase, setSelected, getSelected} = useDatabase();

    const handleInputChange = (attribute: string, value: string | number | boolean) =>
    {
        console.log('ko')
        if (getSelected())
        {
            console.log('ok')
            const updatedSelected: any = { ...getSelected(), [attribute]: value };
            updateDatabase(updatedSelected);
        }
    };

    if (database.selected !== undefined && database.selectedType !== undefined) {return (
    <div>
        {Object.keys(database[database.selectedType][database.selected]).map((attribute, index) => ((
            attribute === "id" || database.selected === undefined || database.selectedType === undefined ? null :
            (
                typeof (database[database.selectedType][database.selected] as any)[attribute] === "string" ?
                (
                    <div key={index}>
                    <p>{attribute}</p>
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
                    <p>{attribute}</p>
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
                    <p>{attribute}</p>
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
        <Bouton content="x" onClick={() => setSelected()}/>
    </div>
    )} else return <div>C</div>;
}

export default Modif;