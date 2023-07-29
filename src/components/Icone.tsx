import './Icone.css';

function Icone({src, type} : {src:string, type:number}) {
    return (
        <img className={`icon${type}`} src={src} alt="" />
    );
}

export default Icone;