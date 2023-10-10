import { ChangeEvent, useState } from 'react';
import './LoadAndSave.css';
import { useDatabase } from './useDatabase';
import { DatabaseData } from './interfaces/databaseData';
import { isDatabaseDataValid } from './interfaces/typeTest';

function LoadAndSave() {
    const {database, updateDatabase} = useDatabase();
    const [loadState, updateLoadState] = useState(0);

    function createTextFile(content: string, fileName: string) {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
      
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const handleDownload = () => {
        createTextFile(JSON.stringify(database), "database.json");
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target) {
                    const content = e.target.result as string;

                    try {
                        const parsedData : DatabaseData = JSON.parse(content);
                        if (isDatabaseDataValid(parsedData))
                        {
                            updateDatabase(parsedData);
                            updateLoadState(1);
                        }
                        else
                        {
                            console.log("INVALD DATABASE:", parsedData);
                            updateLoadState(2);
                        }
                    } catch (error) {
                        console.error("Erreur lors de la lecture du fichier JSON :", error);
                    }
                }
            };

            reader.readAsText(file);
        }
    };
    

    return (
        <div className='charger-sauvegarder'>
            <div>
                <label htmlFor="charger" className="bouton-charger" id={loadState === 1 ? 'loaded' : loadState === 2 ? 'error' : ''}>
                    Charger
                </label>
                <input
                type="file"
                accept=".json"
                id="charger"
                onChange={handleUpload}
                style={{ display: 'none' }}
                />
            </div>

            <div>
                <div onClick={handleDownload} className='bouton-sauvegarder'>
                    Sauvegarder
                </div>
            </div>
        </div>
    );
}

export default LoadAndSave;