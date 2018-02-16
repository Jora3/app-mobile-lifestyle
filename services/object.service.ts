import {ObjectModel} from "../models/object.model";
import {Http} from "@angular/http";


export class ObjectService {
  static url = "https://app-server-lifestyles.herokuapp.com/";
  public static serverURL = "https://app-server-lifestyles.herokuapp.com/lifestyles";

 /* static url = "http://localhost:8082/";
  public static serverURL = "http://localhost:8082/lifestyles";*/

  public static goToGet(serviceName: string, header: string): string {
    console.log(this.url + serviceName + '?' + header);
    return this.url + serviceName + '?' + header;
  }

  public getObject(http: Http, serviceName: string, header: string): Promise<any> {
    return http.get(ObjectService.goToGet(serviceName, header))
      .toPromise()
      .then(response => response.json() as ObjectModel);
  }

  public static getCurUser():any{
    return JSON.parse(sessionStorage.getItem("user_session"));
  }

  public static now(){
    return new Date().toLocaleString().replace("à ", "");
  }
}
