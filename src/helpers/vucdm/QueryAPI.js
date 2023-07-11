import {generateId} from '@allmaps/id'

// page: https://vu.contentdm.oclc.org/digital/api/collections/krt/items/1047/false
// single: https://vu.contentdm.oclc.org/digital/api/collections/krt/items/2426/false
//      parentId = -1

// https://geoplaza.vu.nl/projects/viewer/?mode=cdm&id=1187&single=true
// Query the api for the id
// Form a viewer json object

import axios from "axios";

const CDM_API = 'https://vu.contentdm.oclc.org/digital/api/collections/';
const CDM_IIIF = 'https://cdm21033.contentdm.oclc.org/digital/iiif/';


// https://cdm21033.contentdm.oclc.org/iiif/2/krt:124/manifest.json
// https://cdm21033.contentdm.oclc.org/iiif/2/krt:102/info.json

async function annotationUrl(iiif_url) {
    let id = await generateId(iiif_url);

    let url = 'https://annotations.allmaps.org/images/' + id;
    console.log(url);
    const data = await axios.get(url).then(result => {
        if (Object.prototype.hasOwnProperty.call(result, 'error')) {
            return false;
        } else {
            /*
                 calculate bbox:
                 loop over features.
                 Keep min geometry.coordinates[0] geometry.coordinates[1]
                 and max geometry.coordinates[0] geometry.coordinates[1]
                 bbox: [min[0],min[1],max[0],max[1]]
             */
            let min1 = 180
            let max1 = -180
            let min0 = 90
            let max0 = -90
            for (const item in result.items)
                for (const feature in item.body.features) {
                    if (feature.geometry.coordinates[0] < min0) {
                        min0 = feature.geometry.coordinates[0];
                    }
                    if (feature.geometry.coordinates[0] > max0) {
                        max0 = feature.geometry.coordinates[0];
                    }
                    if (feature.geometry.coordinates[1] < min1) {
                        min1 = feature.geometry.coordinates[1];
                    }
                    if (feature.geometry.coordinates[1] > max1) {
                        max1 = feature.geometry.coordinates[1];
                    }
                }
            return { 'url': url, 'bbox': [min0, min1, max0, max1] };
        }
    }, error => {
        console.error(error);
        return false;
    });
    return data;
}

async function doCdmQuery(col, item) {
    const url = CDM_API + col + '/items/' + item + '/false';
    console.log('***** do cdm query')
    console.log(url);
    const data = await axios.get(url).then(result => {
        console.log('***** result')
        console.log(result);
        const data = result.data
        if (Object.prototype.hasOwnProperty.call(data, 'parentId')) {
            console.log('***** analyzing result')
            const parentId = data.parentId;
            let cpd = false;
            let ids = [];
            let title = '';
            if (parentId == -1) {
                // single
                ids.push(item);
                title = data.fields[0].value;
            } else {
                // compound
                for (const child of data.parent.children) {
                    ids.push(child.id);
                }
                title = data.parent.fields[0].value;
                cpd = true;
            }
            console.log(ids, title, cpd);
            return {
                'ids': ids,
                'title': title,
                'cpd': cpd
            }
        } else {
            return false;
        }
    }, error => {
        console.error(error);
        return false;
    });
    return data;
}

function maxBbox(bbox = [180, -180, 90, -90], box) {
    // extend the bbox so box fits within it
    if (box[0] < bbox[0]) {
        bbox[0] = box[0]
    }
    if (box[1] < bbox[1]) {
        bbox[1] = box[1]
    }
    if (box[2] > bbox[2]) {
        bbox[2] = box[2]
    }
    if (box[3] > bbox[3]) {
        bbox[3] = box[3]
    }
    return bbox;
}

export async function viewerDataCdm(col, item, single) {
    let data = {
        "crs": "EPSG:3857",
        "title": "",
        "url": "https://geoplaza.vu.nl/projects/viewer/",
        "bbox": [],
        "services": [
            {
                "url": "dummy",
                "type": "allmaps",
                "layers": []
            }
        ]
    }
    let template_layer = {
        "id": "",
        "title": "",
        "label": "",
        "options": {
            "annotation_urls": []
        },
        "visible": true,
        "opacity": 0.8,
        "zindex": 100
    }
    console.log('***** something');
    const result = await doCdmQuery(col, item);
    console.log('***** result ' +  result.ids);

    //const result = doCdmQuery(col, item);
    return result.then((cdmdata) => {
        console.log('***** now do something with the query result');
        console.log(cdmdata.ids);
        console.log(cdmdata.cpd);
        if (single) {
            // everything in a single layer
            console.log('********* construct single layer');
            let annotations = [];
            if (cdmdata.ids) {
                let bbox = [180, -180, 90, -90];
                for (const id of cdmdata.ids) {
                    console.log(CDM_IIIF + col + "/" + id);
                    const aresult = annotationUrl(CDM_IIIF + col + "/" + id);
                    aresult.then((d) => {
                        if (d) {
                            annotations.push(d.url);
                            bbox = maxBbox(bbox, d.bbox)
                            console.log('******* bbox for ' + id)
                            console.log(d.bbox)
                        }
                    })
                }
                data.title = cdmdata.title;
                data.bbox = bbox;
                data.services[0].layers[0] = template_layer;
                data.services[0].layers[0].title = cdmdata.title;
                data.services[0].layers[0].label = cdmdata.title;
                data.services[0].layers[0].annotation_urls = annotations;
            }
            console.log('****** return data');
            console.log(data);
            return data;
        } else {
            console.log('********* construct multiple layer');
            // each page gets its own layer
            //let ids, title, cpd = doCdmQuery(col, item);
            if (cdmdata.ids) {
                let bbox = [180, -180, 90, -90];
                for (const id of cdmdata.ids) {
                    let annotations = [];
                    let url, box = annotationUrl(CDM_IIIF + col + "/" + id);
                    if (url) {
                        annotations.push(url);
                        bbox = maxBbox(bbox, box)
                        let l = template_layer;
                        l.annotation_urls = annotations;
                        l.id = id;
                        let pagetitle = ''; // look up with cdm api
                        l.title = pagetitle;
                        l.label = pagetitle;
                        data.services[0].layers.append(l);
                    }
                }
                data.title = cdmdata.title;
                data.bbox = bbox;
            }
        }
        return data;
    });
}

