import {Component} from "@angular/core";
import {ActionSheetController, ModalController, Platform, ToastController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";
import {Addstyles} from "../addstyles/addstyles";
import {ObjectService} from "../../services/object.service";
import {Partage} from "../partage/partage";
import {Suggestion} from "../suggestion/suggestion";
import {ActualitePage} from "../actualite/actualite";

@Component({
  selector: 'page-nouvelles',
  templateUrl : 'nouvelles.html'
})
export class Nouvelles{
  services: ActualiteService;
  suggestions: any;
  informations: string;
  nombreSuggestion: number = 0;
  curUser: any;

  constructor(public http: Http,
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController) {
    this.curUser = ObjectService.getCurUser();
    this.services = new ActualiteService(http);
    this.nouvelles();
  }

  public doSuggerer(suggestion: any) {
    let suggerer = this.modalCtrl.create(Suggestion, suggestion);
    suggerer.present();
  }

  public doPartage(suggestion: any) {
    let partage = this.modalCtrl.create(Partage, suggestion);
    partage.present();
  }

  addAsFavoris(publication: any) {
    let menu = new Addstyles(this.platform, this.actionsheetCtrl, this.toastCtrl);
    menu.openFromActualite(this.services, ActualitePage.curUser.personneId, publication);
  }

  doRefresh(refresher) {
    this.suggestions = null;
    this.informations = null;
    refresher.complete();
    this.nouvelles();
  }

  private nouvelles() {
    this.services.getNouvelles(this.curUser.personneId).then(nouvellesFetched => {
      if (nouvellesFetched.erreur) {
        this.informations = nouvellesFetched.object;
      } else {
        this.nombreSuggestion = nouvellesFetched.object.length;
        if (this.nombreSuggestion != 0) {
          this.informations = "Vous aviez recu " + this.nombreSuggestion + " idée(s)";
        }else{
          this.informations = "Vous aurez bientôt des idée à decouvrire";
        }
        this.suggestions = nouvellesFetched.object;
        console.log(this.suggestions);
      }
    });
  }
}
