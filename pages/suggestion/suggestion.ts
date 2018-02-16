import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController, NavParams, ViewController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {ObjectService} from "../../services/object.service";

@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html'
})
export class Suggestion {
  curUser: any;
  publication: any;
  service: ActualiteService;
  information: string = "";

  private listAmis: string;

  constructor(private params: NavParams,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private http: Http) {

    this.curUser = ObjectService.getCurUser();
    this.service = new ActualiteService(this.http);
    this.publication = this.params.data;
    this.setListAmis();
  }

  public doSuggerer(personneId: string): void {
    let aBoutton = document.getElementById(personneId);
    if (aBoutton.innerText === "Suggerer") {
      this.doAction(aBoutton, "boutton-annulation", "Annuler", "suggerer", personneId);
    } else if (aBoutton.innerText === "Annuler") {
      this.doAction(aBoutton, "boutton-suggestion", "Suggerer", "annulerSuggestion", personneId);
    }
  }

  public doTerminer() {
    this.viewCtrl.dismiss();
  }

  private doAlert(titre: string, message: string): void {
    let alert = this.alertCtrl.create({
      title: titre,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  private setListAmis(): void {
    this.service.amisASuggerer(this.curUser.personneId, this.publication.publicationId).then(
      amisFetched => {
        if (amisFetched.erreur) {
          this.doAlert("Il y a une erreur", amisFetched.object);
        } else {
          if (amisFetched.object.length == 0) this.information = "Aucun(e)s ami(e)s à suggerer pour le moment";
          this.listAmis = amisFetched.object;
        }
      });
  }

  private doAction(aBoutton: HTMLElement, set_boutton: string, set_boutton_name: string, do_action: string, personneId2: string): void {
    aBoutton.setAttribute("class", set_boutton);
    aBoutton.innerText = "...";
    this.service.suggerer(do_action, this.curUser.personneId, this.publication.publicationId, personneId2)
      .then(suggestionFetched => {
        if (suggestionFetched.erreur) {
          this.doAlert("Il y a une erreur", suggestionFetched.object);
        } else {
          aBoutton.innerText = set_boutton_name;
          if (set_boutton_name === "Suggerer")
            this.publication.nbSuggestion = this.publication.nbSuggestion - 1;
          else
            this.publication.nbSuggestion = this.publication.nbSuggestion + 1;
        }
      });
  }
}
