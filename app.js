const fs = require('fs');
const filterFolder = `${__dirname}/filters`;
const configFile = `${__dirname}/config-filters.json`;

const start = async () => {
    try {

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
        if (!json.steps) {
            console.log('Revoir les steps');
            return;
        }

        const steps = Object.entries(json.steps);

        let keys = [];
        steps.forEach(([key, value]) => {
            keys.push(key);
        });

        steps.forEach(([key, value]) => {
            if (!key)
                console.log('Il manque une clé sur un step');

            if (!value.filter)
                console.log('Le step n\'a pas d\'attribut filter');

            if (!filters.includes(`${value.filter}.js`))
                console.log(`Le fichier ${value.filter}.js n\'existe pas dans le folder filters`);

            if (!value.params || !Array.isArray(value.params))
                console.log(`Le filtre ${value.filter} n'a pas des params correct.`);

            if (value.next && !keys.includes(value.next))
                console.log(`Le filtre ${value.filter} a une valeur next inexistante`);
        })

        //Executer filters
        executeModule(new Map(steps));

    } catch (e) {
        console.error(e);
    }
}

function executeModule(map, nextExecKey, param) {
    let step;
    let res;
    //Premier appel
    if (!nextExecKey) {
        step = map.entries().next().value[1]
    }
    //Appels suivants
    else
        step = map.get(nextExecKey);

    try {
        console.log(`Exécution du filter ${step.filter}.js`);

        const exec = require(`${filterFolder}/${step.filter}.js`)
        let values = [];
        if (param)
            values.push(param);
        values.push(...step.params.values());
        res = exec(...values);

    } catch (error) {
        throw (`Exécution du filter ${step.filter}.js échoué : ${error}`);
    }

    if (step.next)
        executeModule(map, step.next, res)
}

start();