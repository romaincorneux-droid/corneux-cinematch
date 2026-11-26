// L'écran d'accueil
import { useEffect, useState } from 'react';

export function App() {
    const [soirees, setSoirees] = useState<any[]>([]);
    useEffect(() => {
        fetch('/api/soirees')
            .then((res) => res.json())
            .then((data) => setSoirees(data));
    }, []);


    
    // Page principale du site, affichant la liste des soirées récupérées depuis le serveur
    return (
        <div className="App">
            <h1>Bienvenue sur Cinematch</h1>
            <h2>Liste des soirées</h2>
            <ul>
                {soirees.map((soiree) => (
                    <li key={soiree.id}>
                        <h3>{soiree.titre}</h3>
                        <p>{soiree.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}