import logo from '../ressources/logo.png'
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
    <div className="header">
        <div className="header-left" onClick={set(0)}>
            <img alt="Fire Emblem Calculator" src={logo}/>
        </div>
        <div className="header-right">
        {
            buttons.map((content, index) =>
                <button
                  key={index}
                  className={value === index + 1 ? "active" : "inactive"}
                  onClick={set(index + 1)}
                >
                    {content}
                </button>
            )
        }
        </div>
    </div>
    );
}

export default Menu;