import {Component} from "@angular/core";
import {ActionSheetController, Platform, ToastController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";

@Component({
  selector: 'page-addstyles',
  templateUrl: 'addstyles.html'
})
export class Addstyles {

  constructor(public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public toastCtrl: ToastController) {
  }

  showToastWithCloseButton(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  public deleteSuggestion(service: ActualiteService, personneId: any, suggestionId: any) {
    service.deleteSuggestion(personneId, suggestionId).then(
      suggestionFetched => {
        if (suggestionFetched.erreur) console.log(suggestionFetched.object);
      }
    );
  }

  public addAsFavoris(service: ActualiteService, personneId: any, publicationId: any) {
    service.addInMystyles(personneId, publicationId, "Publics").then(
      inmystylesFetched => {
        if (inmystylesFetched.erreur) {
          this.showToastWithCloseButton(inmystylesFetched.object);
        } else {
          this.showToastWithCloseButton('Vous pouvez configurer qui peut voir ceci dans vos favoris');
        }
      }
    );
  }

  public openFromActualite(service: ActualiteService, personneId: any, publication: any) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Ajouter',
      cssClass: 'action-sheets-suggestion',
      buttons: [
        {
          text: 'Favoris',
          icon: !this.platform.is('ios') ? 'ios-star-outline' : null,
          handler: () => {
            this.addAsFavoris(service, personneId, publication.publicationId);
          }
        }
      ]
    });
    actionSheet.present();
  }

  public openAction(service: ActualiteService, personneId: any,
                    suggestion: any, mysuggestions: any) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Suggestion',
      cssClass: 'action-sheets-suggestion',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-trash-outline' : null,
          handler: () => {
            this.deleteIn(mysuggestions, suggestion);
            this.deleteSuggestion(service, personneId, suggestion.suggestionId);
          }
        },
        {
          text: 'Favoris',
          icon: !this.platform.is('ios') ? 'ios-star-outline' : null,
          handler: () => {
            this.deleteIn(mysuggestions, suggestion);
            this.addAsFavoris(service, personneId, suggestion.publication.publicationId);
          }
        }
      ]
    });
    actionSheet.present();
  }

  private deleteIn(mysuggestions: any, suggestion: any): void {
    let taille = mysuggestions.length;
    for (let i = 0; i < taille; i++) {
      if (suggestion.suggestionId === mysuggestions[i].suggestionId) {
        mysuggestions.splice(i, 1);
        break;
      }
    }
  }
}
