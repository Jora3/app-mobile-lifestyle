import {Component} from "@angular/core";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";
import {LoadingController, NavController} from "ionic-angular";
import {HomePage} from "../home/home";
import {Inscription} from "../inscription/inscription";

@Component({
  templateUrl: 'login.html',
  selector: 'page-login'
})
export class Login {
  addresse: any;
  password: any;
  userLog: any;
  isValidAddresse: boolean;
  isLoadingData: boolean;
  service: ActualiteService;
  information: any;

  constructor(private http: Http, private nav: NavController, public loadingCtrl: LoadingController) {
    this.service = new ActualiteService(this.http);
    if(sessionStorage["user_session"]) {
      this.nav.push(HomePage, {}, {animate: true});
    }
  }

  isValideInputLogin(): boolean {
    if (this.addresse === undefined || this.addresse === "") {
      this.information = "Veuilliez inserer votre Addresse electronique.";
      return false;
    } else if (this.password === undefined || this.password === "") {
      this.information = "Les mots de passe sont obligatoire";
      return false;
    }
    return true;
  }

  doLogin() {
    if (this.isValideInputLogin()) {
      this.information = null;
      this.isLoadingData = true;
      this.service.getInformationLogin(this.addresse, this.password).then(infologinFetched => {
        this.isLoadingData = false;
        if (infologinFetched.erreur) {
          this.information = infologinFetched.object;
        } else {
          this.userLog = infologinFetched.object;
          if (this.userLog.userValid) {
            if (this.userLog.passValid) {
              sessionStorage["user_session"] = JSON.stringify(this.userLog);
              this.nav.push(HomePage, {}, {animate: true});
            } else {
              this.isValidAddresse = this.userLog.userValid;
              this.information = this.userLog.information;
            }
          } else {
            this.information = this.userLog.information;
          }
        }
      }).catch(erreur => this.information = "Connexion troublé");
    }
  }

  initLogin() {
    this.nav.push(Login, {}, {animate: true});
  }

  goToinscription() {
    this.nav.push(Inscription, {}, {animate: true});
  }

  goTopassforget() {
    this.information = "Nous y travaillons là dessus.";
  }
}
