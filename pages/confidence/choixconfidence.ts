import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";

@Component({
  selector: 'page-choixconfidence',
  templateUrl: 'choixconfidence.html'
})
export class Choixconfidence {
  publics = "publics";
  entreAmis = "entreAmis";
  amisEtSesAmis = "amisEtSesAmis";
  prive = "prive";
  mistyle: any;
  service: ActualiteService;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public http: Http) {
    this.mistyle = this.params.data;
    this.service = new ActualiteService(this.http);
  }

  close(value: string) {
    if (value === "publics") {
      this.mistyle.security.publics = true;
      this.mistyle.security.amisEtSesAmis = false;
      this.mistyle.security.entreAmis = false;
      this.mistyle.security.prive = false;
    }

    if (value === "amisEtSesAmis") {
      this.mistyle.security.publics = false;
      this.mistyle.security.amisEtSesAmis = true;
      this.mistyle.security.entreAmis = false;
      this.mistyle.security.prive = false;
    }

    if (value === "entreAmis") {
      this.mistyle.security.publics = false;
      this.mistyle.security.amisEtSesAmis = false;
      this.mistyle.security.entreAmis = true;
      this.mistyle.security.prive = false;
    }

    if (value === "prive") {
      this.mistyle.security.publics = false;
      this.mistyle.security.amisEtSesAmis = false;
      this.mistyle.security.entreAmis = false;
      this.mistyle.security.prive = true;
    }
    this.service.updateConfidenceMIStyle(this.mistyle.personneId, this.mistyle.mistylesId, value);
    this.viewCtrl.dismiss();
  }
}
