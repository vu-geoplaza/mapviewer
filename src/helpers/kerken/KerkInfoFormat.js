const keys = [
    {
        'name': 'naam',
        'label': 'Naam',
        'show': true,
        f: function (d) {
            const data=d[this.name];
            let html = '<ul>';
            for (let i = 0; i < data.length; i++) {
                html += '<li>' + data[i].Naam_Kerk;
                if (data[i].Van !== 0) {
                    html += ' (' + data[i].Van;
                    if (data[i].Tot !== 0) {
                        html += '-' + data[i].Tot;
                    }
                    html += ')';
                }
                if (data[i].Opmerkingen !== '') {
                    html += ' [' + data[i].Opmerkingen + ']';
                }
                html += '</li>'
            }
            html += '</ul>';
            console.log(data);
            return html;
        }

    },
    {
        'name': 'denominatie',
        'label': 'Denominatie',
        'show': true,
        f: function (d) {
            const data=d[this.name];
            let html = '<ul>';
            for (let i = 0; i < data.length; i++) {
                html += '<li>' + data[i].Denominatie;
                if (data[i].Van !== 0) {
                    html += ' (' + data[i].Van;
                    if (data[i].Tot !== 0) {
                        html += '-' + data[i].Tot;
                    }
                    html += ')';
                }
                if (data[i].Opmerkingen !== '') {
                    html += ' [' + data[i].Opmerkingen + ']';
                }
                html += '</li>'
            }
            html += '</ul>';
            console.log(data);
            return html;
        }

    },
    {
        'name': 'Adres',
        'show': true,
        f: function (d) {
            return d.Straatnaam + ' ' + d.Huisnummer + ', ' + d.Plaats;
        }

    },
    {
        'name': 'Jaar_ingebruikname',
    },
    {
        'name': 'Jaar_Consecratie',
    },
    {
        'name': 'Jaar_buiten_gebruik',
    },
    {
        'name': 'Vorm_type',
    },
    {
        'name': 'Eretitel_Basiliek',
    },
    {
        'name': 'architect',
        'label': 'Architect(en)',
        'show': true,
        f: function (d) {
            const data=d[this.name];
            let html = '<ul>';
            for (let i = 0; i < data.length; i++) {
                html += '<li>' + data[i].Architect;
                if (data[i].Opmerkingen !== '') {
                    html += ' [' + data[i].Opmerkingen + ']';
                }
                html += '</li>'
            }
            html += '</ul>';
            return html;
        }

    },
    {
        'name': 'Huidige_bestemming',
    },
    {
        'name': 'Opmerkingen_bestemming',
    },
    {
        'name': 'Stijl',
    },
    {
        'name': 'Stijl_School',
    },
    {
        'name': 'Opmerkingen_stijl',
    },
    {
        'name': 'Monumenten_Status',
    },
    {
        'name': 'Rijksmonument_nummer',
    },
    {
        'name': 'Provinciaal_monument_ID',
    },

    {
        'name': 'Gemeente_monument_ID',
    },
    {
        'name': 'Bijzonderheden',
    },
    {
        'name': 'bronnen',
        'label': 'Bronnen',
        'show': true,
        f: function (d) {
            const data=d[this.name];
            let html = '<ul>';
            for (let i = 0; i < data.length; i++) {
                html += '<li>';
                if (data[i].Auteur !== '') {
                    html += data[i].Auteur;
                }
                html += '<i>' + data[i].Titel + '</i>';
                if (data[i].Jaar_van_Uitgave !== '') {
                    html += ' (' + data[i].Jaar_van_Uitgave + ')';
                }
                if (data[i].Link !== '') {
                    html += ' [<a href="' + data[i].Link + '" target="_blank">link</a>]';
                }
                if (data[i].Permalink !== '') {
                    html += ' [<a href="' + data[i].Permalink + '" target="_blank">link</a>]';
                }
                if (data[i].Opmerkingen !== '') {
                    html += ' [' + data[i].Opmerkingen + ']';
                }
                html += '</li>'
            }
            html += '</ul>';
            return html;
        }
    },
    {
        name: 'streetview',
        label: 'Google Streetview',
        'show': true,
        f: function (d) {
            return '<a href="'+ d.streetview +'" target="_blank">Streetview nabij locatie</a>';
        }
    }
]

/*
Toponiem-Streek

Dubbeltorenfront
Vieringtoren
Traptoren
Vrijstaande_toren
Overige_torens
Koepel
Dakruiter
Fronttoren
Opmerkingen
uiterlijke_kenmerken_gecontroleerd
bag_pand_id
]
*/








// Convert info json into displayable key-value pairs suitable for a table
export function formatInfo(data) {
    let item={};
    item.rows=[];
    //for (let key in data) {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i].name;
        let val = '';
        if (keys[i].f) {
            val = keys[i].f(data);
        } else {
            val = data[key];
        }
        let label = key.replace('_', ' ');
        if (keys[i].label) {
            label=keys[i].label;
        }
        item.rows.push({key: '<b>' + label + '</b>', value: val});
    }
    return item;
}

