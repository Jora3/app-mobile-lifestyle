import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-infoclient',
  templateUrl: 'infoclient.html'
})
export class Infoclient {

  nom: string;
  prenom: string;
  naissance: string;
  sexe: string;
  mail: string;
  password: string;

  information: string;
  service: ActualiteService;
  loadingData :boolean;

  constructor(public http: Http,
              public navParams: NavParams,
              public navCtrl: NavController) {
    this.mail = navParams.get("mail");
    this.password = navParams.get("password");
    this.service = new ActualiteService(this.http);
  }

  isValidInformation(): boolean {
    if (this.nom === undefined || this.nom === "") {
      this.information = "Votre nom est vide";
      return false;
    }
    if (this.prenom === undefined || this.prenom === "") {
      this.information = "Nous aurons besoin de votre prenom.";
      return false;
    }
    return true;
  }

  public doSelect($event) {
    this.sexe = $event;
  }

  public next() {
    if (this.isValidInformation()) {
      let infoPersonne = this.nom + "/" + this.prenom + "/" + this.naissance + "/" + this.sexe + "/" + this.mail + "/" + this.password;
      this.loadingData = true;
      this.service.doInscription(infoPersonne).then(inscriptionFetched => {
        this.loadingData = false;
        if (inscriptionFetched.erreur) {
          this.information = inscriptionFetched.object;
        } else {
          let pers = inscriptionFetched.object;
          let userLog = JSON.parse("{}");
          userLog.personneId = pers.personneId;
          userLog.nomComplet = pers.nom+" "+pers.prenom;
          userLog.userValid = true;
          userLog.passValid = true;
          userLog.personne = pers;
          userLog.nombreAmis = 0;
          userLog.nombreAbonnes = 0;
          sessionStorage["user_session"] = JSON.stringify(userLog);
          console.log(sessionStorage.getItem("user_session"));
          this.navCtrl.push(HomePage, {}, {animate: true});
        }
      });
    }
  }
}
