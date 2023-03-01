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


function annotationUrl(iiif_url) {
    let id = generateId(iiif_url);
    let url = 'https://annotations.allmaps.org/images/' + id;
    console.log(url);
    axios.get(url).then(result => {
        if (result.hasOwnProperty('error')) {
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
            return url, [min0, min1, max0, max1];
        }
    }, error => {
        console.error(error);
        return false;
    });
}

function doCdmQuery(col, item) {
    const url = CDM_API + col + '/items/' + item + '/false';
    axios.get(url).then(result => {
        if (result.hasOwnProperty('parentId')) {
            const parentId = result.parentId;
            const cpd = false;
            let ids = [];
            let title = '';
            if (parentId == -1) {
                // single
                ids.push(item);
                const title = result.fields[0].value;
            } else {
                // compound
                for (const child of result.parent.children) {
                    ids.push(child.id);
                }
                const title = result.parent.fields[0].value;
                const cpd = true;
            }
            return ids, title, cpd;
        } else {
            return false, false, false;
        }
    }, error => {
        console.error(error);
        return false, false, false;
    });
}

export function viewerData(col, item, single) {
    let data = {
        "crs": "EPSG:3857",
        "title": "",
        "url": "https://geoplaza.vu.nl/projects/viewer/",
        "bbox": [],
        "services": [
            {
                "url": "dummy",
                "type": "allmaps",
                "layers": [
                ]
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
    let ids, title, cpd = doCdmQuery(col, item);
    if (single) {
        // everything in a single layer
        let annotations = [];
        if (ids) {
            let bbox = [180, -180, 90, -90];
            for (const id of ids) {
                let url, box = annotationUrl(CDM_IIIF + col + "/" + item);
                if (url) {
                    annotations.push(url);
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
                }
                data.title = title;
                data.bbox = bbox;
                data.layers[0] = template_layer;
                data.layers[0].title = title;
                data.layers[0].label = title;
                data.layers[0].annotation_urls = annotations;
            }
        }
        return data;
    } else {
        // each page gets its own layer
        let ids, title, cpd = doCdmQuery(col, item);
        if (ids) {
            let bbox = [180, -180, 90, -90];
            for (const id of ids) {
                let url, box = annotationUrl(CDM_IIIF + col + "/" + item);
                if (url) {
                    annotations.push(url);
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
                    let l = template_layer;
                    l.annotation_urls = annotations;
                    l.id = id;
                    let pagetitle = ''; // look up with cdm api
                    l.title = pagetitle;
                    l.label = pagetitle;
                    data.layers.append(l);
                }
            }
            data.title = title;
            data.bbox = bbox;
        }
    }
    return data;
}

