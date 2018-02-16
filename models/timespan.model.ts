import {ObjectService} from "../services/object.service";

export class TimespanModel{

  dateTimeNow : string;

  constructor(){
    this.dateTimeNow = ObjectService.now();
  }
}
