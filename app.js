const fs = require('fs')

const start = async () => {
    try {
        const filterFolder = `${__dirname}/filters`;
        const configFile = `${__dirname}/config-filters.json`;

        if (!fs.existsSync(filterFolder)) {
            console.log('Le dossier filters n\'existe pas.');
            return;
        }
        if (!fs.existsSync(configFile)) {
            console.log('Le fichier config-filters.json n\'existe pas.');
            return;
        }

        const filters = await fs.readdirSync(filterFolder);
        if (filters)
            console.log(filters);

        filters.forEach(element => {
            if (typeof (require(`${filterFolder}/${element}`)) !== 'function') {
                console.log(`${element} ne retourne pas une fonction`);
            }
        });

        //Lire config-filters.json

        const data = fs.readFileSync(configFile, 'utf8');
        const json = JSON.parse(data);
        if(!json.steps){
            console.log('Revoir les steps');
            return;
        }
        console.log(json.steps);



    } catch (e) {
        console.error(e);
    }
}
start();