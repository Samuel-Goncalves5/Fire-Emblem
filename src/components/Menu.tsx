import Bouton from "./Bouton";
import "./Menu.css"

function Menu(
    { value, setter } : { value: number, setter:(menu:number)=>void }) 
{
    function set(id:number) {
        return function setid() {
            setter(value === id ? 0 : id);
        }
    }

    const buttons = ["Base de donnée", "Charger / Sauvegarder", "Simulateur"];

    return (
    <>
    {
        buttons.map((value, index) =>
            <Bouton
                key={index}
                content={value}
                onClick={set(index + 1)}
            />
        )
    }
    </>
    );
}

export default Menu;