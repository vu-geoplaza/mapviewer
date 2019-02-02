import ViewerLayer from './ViewerLayer';

class ViewerService {
  type='';
  url='';
  layers=[];
  constructor(servicejson){
    console.log(servicejson);
    if (servicejson.type) this.type=servicejson.type;
    if (servicejson.url) this.url=servicejson.url;
    if (servicejson.layers) {
      this.layers=[];
      for (const l of servicejson.layers){
        this.layers.push(new ViewerLayer(l));
      }
    }
    console.log(this);
  }
}

export default ViewerService;
