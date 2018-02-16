import {Component} from "@angular/core";
import {Suggestion} from "../suggestion/suggestion";
import {Partage} from "../partage/partage";
import {Http} from "@angular/http";
import {ActionSheetController, ModalController, Platform, ToastController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {Addstyles} from "../addstyles/addstyles";
import {ObjectService} from "../../services/object.service";

@Component({
  selector: 'page-mysuggestion',
  templateUrl: 'mysuggestion.html'
})
export class Mysuggestion {
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
    this.mySuggestions();
  }

  public doSuggerer(suggestion: any) {
    let suggerer = this.modalCtrl.create(Suggestion, suggestion);
    suggerer.present();
  }

  public doPartage(suggestion: any) {
    let partage = this.modalCtrl.create(Partage, suggestion);
    partage.present();
  }

  public doAddInMystyles(suggestion: any) {
    let menu = new Addstyles(this.platform, this.actionsheetCtrl, this.toastCtrl);
    menu.openAction(this.services, this.curUser.personneId, suggestion, this.suggestions);
  }

  doRefresh(refresher) {
    this.suggestions = null;
    this.informations = null;
    refresher.complete();
    this.mySuggestions();
  }

  private mySuggestions() {
    this.services.mySuggestionsList(this.curUser.personneId).then(mysuggestionsFetched => {
      if (mysuggestionsFetched.erreur) {
        this.informations = mysuggestionsFetched.object;
      } else {
        this.nombreSuggestion = mysuggestionsFetched.object.length;
        if (this.nombreSuggestion == 0) {
          this.informations = "Vous n'avez pas encore des suggestions à afficher.";
        } else {
          this.informations = "OH! cool vous aviez " + this.nombreSuggestion + " suggestion(s)";
        }
        this.suggestions = mysuggestionsFetched.object;
        console.log(this.suggestions);
      }
    });
  }
}
