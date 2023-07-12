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
    let min1 = 180
    let max1 = -180
    let min0 = 90
    let max0 = -90
    const response = await fetch(url)
    const annotation = await response.json()
    if (!('error' in annotation)) {
        for (const i in annotation.items) {
            const item = annotation.items[i];
            for (const j in item.body.features) {
                const feature = item.body.features[j];
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
        }
        //console.log('bbox: ' + min0 + ' ' + min1 + ' ' + max0 + ' ' + max1);
        return { 'url': url, 'bbox': [min0, min1, max0, max1] };
    } else {
        console.log('Error loading annotation: ' + url + ' ' + annotation.error)
        return false;
    }
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
    console.log('maxBbox');
    console.log(bbox, box);
    // extend the bbox so box fits within it
    if (box[0] < bbox[0]) {
        bbox[0] = box[0]
    }
    if (box[1] > bbox[1]) {
        bbox[1] = box[1]
    }
    if (box[2] < bbox[2]) {
        bbox[2] = box[2]
    }
    if (box[3] > bbox[3]) {
        bbox[3] = box[3]
    }
    console.log(bbox);
    return bbox;
}

async function processCdmIds(col, ids, annotations, bbox) {
    for (const id of ids) {
        console.log(CDM_IIIF + col + "/" + id);
        const aresult = annotationUrl(CDM_IIIF + col + "/" + id);
        await aresult.then((d) => {
            console.log('********* result for ' + id)
            console.log(d)
            if (d) {
                annotations.push(d.url);
                bbox = maxBbox(bbox, d.bbox)
                console.log('******* bbox for ' + id)
                console.log(d.bbox)
            }
        })
    }
    return { 'annotations': annotations, 'bbox': bbox };
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
    const cdmdata = await doCdmQuery(col, item);
    console.log('***** result ' +  cdmdata.ids);


    if (cdmdata) {
        console.log('***** now do something with the query result');
        console.log(cdmdata.ids);
        console.log(cdmdata.cpd);
        if (single) {
            let bbox = [180, -180, 90, -90];
            // everything in a single layer
            console.log('********* construct single layer');
            let annotations = [];
            if (cdmdata.ids) {
                const d = await processCdmIds(col, cdmdata.ids, annotations, bbox);
                data.title = cdmdata.title;
                data.bbox = d.bbox;
                data.services[0].layers[0] = template_layer;
                data.services[0].layers[0].title = cdmdata.title;
                data.services[0].layers[0].label = cdmdata.title;
                data.services[0].layers[0].options.annotation_urls = d.annotations;
            }
            return data;
        } else {
            console.log('********* construct multiple layer');
            // each page gets its own layer
            //let ids, title, cpd = doCdmQuery(col, item);
            if (cdmdata.ids) {
                let bbox = [180, -180, 90, -90];
                for (const id of cdmdata.ids) {
                    let annotations = [];
                    const aresult = annotationUrl(CDM_IIIF + col + "/" + id);
                    aresult.then((d) => {
                        if (d) {
                            annotations.push(d.url);
                            bbox = maxBbox(bbox, d.bbox)
                            let l = template_layer;
                            l.annotation_urls = annotations;
                            l.id = id;
                            let pagetitle = ''; // look up with cdm api
                            l.title = pagetitle;
                            l.label = pagetitle;
                            data.services[0].layers.append(l);
                        }
                    });
                }
                data.title = cdmdata.title;
                data.bbox = bbox;
            }
        }
        return data;
    }
}

