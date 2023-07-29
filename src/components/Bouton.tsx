import { MouseEventHandler } from "react";
import Icone from "./Icone";

import './Bouton.css';

function Bouton(
    {
        content,
        onClick,
        src
    } : {
        content : string,
        onClick : MouseEventHandler<HTMLButtonElement>,
        src?: string
    })
{
    return src === undefined ? (
        <button className="button1" onClick={onClick}>
            {content}
        </button>
    ) : (
        <button className="button2" onClick={onClick}>
            <Icone src={src} type={2}/>
            {content}
        </button>
    );
}

export default Bouton;