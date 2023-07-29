import { ChangeEvent } from 'react';
import './LoadAndSave.css';
import { useDatabase } from './useDatabase';
import { DatabaseData } from './interfaces/databaseData';

function LoadAndSave() {
    const {database, updateDatabase} = useDatabase();

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
                        updateDatabase(parsedData);
                    } catch (error) {
                        console.error("Erreur lors de la lecture du fichier JSON :", error);
                    }
                }
            };

            reader.readAsText(file);
        }
    };
    

    return (
        <>
            <br/><br/>
            
            <input
                type="file"
                accept=".json"
                onChange={handleUpload}
            />
            
            <br/><br/>
            
            <button onClick={handleDownload}>
                Télécharger
            </button>
        </>
    );
}

export default LoadAndSave;