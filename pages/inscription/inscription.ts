import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Login} from "../login/login";
import {Infoclient} from "../infoclient/infoclient";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";

@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})
export class Inscription {
  mail: string;
  password: string;
  confirm: string;

  loadingData: boolean;
  information: string;
  service: ActualiteService;

  constructor(private http: Http, private nav: NavController) {
    this.service = new ActualiteService(this.http);
  }

  isValidInscription(): boolean {
    if (this.mail === undefined || this.mail === "") {
      this.information = "Votre addresse mail est vide.";
      return false;
    }
    if (this.password === undefined || this.password === "") {
      this.information = "Vous devez mentionner des mots de passe pour securiser votre compte.";
      return false;
    } else {
      let n = this.password.length;
      for (let i = 0; i < n; i++) {
        if (this.password[i] === '/') {
          this.information = "Impossible d'utiliser '/' car c'est reservé pour le système.";
          return false;
        }
      }
    }

    if (this.password !== this.confirm) {
      this.information = "Les deux mots de passe semblent differents";
      return false;
    }
    return true;
  }

  next() {
    this.information = "";
    if (this.isValidInscription()) {
      this.loadingData = true;
      this.service.chekAccountMail(this.mail).then(checkmailFetched => {
        this.loadingData = false;
        if (checkmailFetched.erreur) {
          this.information = checkmailFetched.object;
        } else {
          if (checkmailFetched.object) {
            this.information = "Votre addresse mail appartient déjà à un autre compte.";
          } else {
            this.nav.push(Infoclient, {mail: this.mail, password: this.password}, {animate: true});
          }
        }
      }).catch(erreur => this.information = "Connexion troublé");
    }
  }

  goToLogin() {
    this.nav.push(Login, {}, {animate: true});
  }
}
