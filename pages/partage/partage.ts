import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController, LoadingController, NavParams, ViewController} from "ionic-angular";
import {ActualiteService} from "../../services/actualite.service";
import {ObjectService} from "../../services/object.service";

@Component({
  selector: 'page-partage',
  templateUrl: 'partage.html'
})
export class Partage {
  publication: any;
  typeSecurity: string = "";
  service: ActualiteService;
  curUser: any;

  constructor(private params: NavParams,
              private http: Http,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private loadCrtl: LoadingController) {
    this.curUser = ObjectService.getCurUser();
    this.publication = this.params.data;
    this.service = new ActualiteService(this.http);
  }

  public doAlert(titre: string, message: string) {
    let alert = this.alertCtrl.create({
      title: titre,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  loadData() {
    return this.loadCrtl.create({
      content: "Partage de style encours",
      duration: 6000
    });
  }

  public doSelect($event) {
    this.typeSecurity = $event;
  }

  public doPartage() {
    if (this.typeSecurity === "") {
      this.doAlert("", "Vous devez mentioner la confidentialité du partage");
    } else {
      let loading = this.loadData();
      loading.present();
      this.service.partage(this.typeSecurity, this.curUser.personneId, this.publication.publicationId)
        .then(partageFetched => {
          loading.dismissAll();
          if (partageFetched.erreur) {
            this.doAlert("Il y a une erreur", partageFetched.object);
          } else {
            this.doTerminer();
            this.doAlert("Partage terminer", "Votre partage est envoyé avec succés");
          }
        }).catch(error => this.doAlert("Erreur de la Connection", "Aucune connexion Internet n'est disponible"));
      loading.dismissAll();
    }
  }

  public doTerminer(): void {
    this.viewCtrl.dismiss();
  }
}
