localStorage.setItem("personnages", JSON.stringify([
    {
        name: "Byleth",
        picture: "ressources/avatars/byleth.png",
    },
    {
        name: "Sylvain",
        picture: "ressources/avatars/sylvain.png",
    },
    {
        name: "Ferdinand",
        picture: "ressources/avatars/ferdinand.png",
    }
]));

const personnages = document.querySelector("#personnages");
const armes = document.querySelector("#armes");
const escouades = document.querySelector("#escouades");
loadDatabase();

function loadDatabase() {
    personnages.textContent = '';
    armes.textContent = '';
    escouades.textContent = '';

    const personnagesDB = JSON.parse(localStorage.getItem("personnages"));
    for (perso of personnagesDB)
    {
        const picture = document.createElement("img");
        picture.src = perso.picture;
        
        const infos = document.createElement("p");
        infos.innerHTML = perso.name;

        const element = document.createElement("li");
        element.appendChild(picture);
        element.appendChild(infos);

        personnages.appendChild(element)
    }

    const returnPicture = document.createElement("img");
    returnPicture.src = "ressources/avatars/cross.png";

    const returnInfos = document.createElement("p");
    returnInfos.innerHTML = "Retour";

    const returnButton = document.createElement("li");
    returnButton.setAttribute("id", "retour");
    returnButton.appendChild(returnPicture);
    returnButton.appendChild(returnInfos);

    personnages.appendChild(returnButton)
}

document.querySelector("#database").addEventListener("click", () => {
    if (document.documentElement.id !== "menu-database")
        document.documentElement.id = "menu-database";
    else document.documentElement.id = "menu-background";
});

document.querySelector("#calculator").addEventListener("click", () => {
    if (document.documentElement.id !== "menu-calculator")
        document.documentElement.id = "menu-calculator";
    else document.documentElement.id = "menu-background";
});

document.querySelector("#personnages-menu").addEventListener("click", () => {
    document.documentElement.id = "menu-personnages";
});

document.querySelector("#retour").addEventListener("click", () => {
    document.documentElement.id = "menu-database";
});