import {Component} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from 'ionic-angular';
import {Http} from "@angular/http";
import {Suggestion} from "../suggestion/suggestion";
import {Partage} from "../partage/partage";
import {ActualiteService} from "../../services/actualite.service";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {Listcommentaires} from "../listcommentaires/listcommentaires";
import {Listsuggestions} from "../listsuggestions/listsuggestions";
import {ObjectService} from "../../services/object.service";
import {CommentaireModel} from "../../models/commentaire.model";
import {Addstyles} from "../addstyles/addstyles";
import {VoirprofilePage} from "../voirprofile/voirprofile";
import {Profile} from "../profile/profile";

@Component({
  selector: 'page-actualite',
  templateUrl: 'actualite.html'
})
export class ActualitePage {
  service: ActualiteService;
  loading: any;
  stompClient: any;
  filActualites: any;
  message: any;
  static curUser : any;

  constructor(public http: Http,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public loadCtrl: LoadingController,
              public platform: Platform,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController) {
    ActualitePage.curUser = ObjectService.getCurUser();
    this.initSocket();
    this.service = new ActualiteService(this.http);
    this.actualites();
  }

  public confidence(publication :any){
    if(publication.security.publics) return "Public";
    if(publication.security.entreAmis) return "Amis";
    if(publication.security.amisEtSesAmis) return "Amis et ses amis";
    return "moi uniquement";
  }

  public static upCommentaireLocal(publication: any, message: any) {
    if (!publication.existLastCommentaire) {
      publication.lastCommentaire = {};
      publication.existLastCommentaire = true;
    }
    publication.lastCommentaire.personneNom = this.curUser.nomComplet;
    publication.lastCommentaire.commentaireDate = ObjectService.now();
    publication.lastCommentaire.commentaire = message;
    publication.nbCommentaire += 1;
    console.log(ObjectService.now());
  }

  public static upCommentaireRemote(publication: any, commentaireInfo: any) {
    publication.lastCommentaire = commentaireInfo;
    publication.existLastCommentaire = true;
    publication.nbCommentaire += 1;
  }

  private static isAction(action: string): boolean {
    return action === "NoAction" || action === "Aimer" || action === "Detester" || action === "Adorer";
  }

  private static editIcon(icon: HTMLElement, valeur: number): void {
    let inline: string = "info-in-line";
    let outline: string = "info-out-line";
    if (valeur == 1) {
      icon.setAttribute("class", icon.getAttribute("class").replace(outline, inline));
    } else {
      icon.setAttribute("class", icon.getAttribute("class").replace(inline, outline));
    }
  }

  private static valeur(action: string): number {
    return action === "Adorer" ? 1 : action === "Aimer" ? 2 : action === "Detester" ? 3 : 0;
  }

  private static doSetAction(publication: any, actionDo: string, valeur: number): void {
    let icon: HTMLElement;
    if (actionDo === "Adorer") {
      icon = document.getElementById("1" + publication.publicationId);
      publication.adorer += valeur;
    }
    if (actionDo === "Aimer") {
      icon = document.getElementById("2" + publication.publicationId);
      publication.aimer += valeur;
    }
    if (actionDo === "Detester") {
      icon = document.getElementById("3" + publication.publicationId);
      publication.detester += valeur;
    }
    ActualitePage.editIcon(icon, valeur);
  }

  public doAlert(titre: string, message: string) {
    let alert = this.alertCtrl.create({
      title: titre,
      message: message,
      buttons: ['Ok']
    });
    if (this.loading !== undefined) this.loading.dismissAll();
    alert.present();
  }

  loadData() {
    this.loading = this.loadCtrl.create({
      content: "Chargement en cours",
      duration :6000
    });
    this.loading.present();
  }

  public doAction(publication: any, actionDo: string): void {
    let oldReaction = publication.reaction;
    if (ActualitePage.isAction(oldReaction)) {
      publication.reaction = actionDo;
      if (oldReaction === "NoAction") {
        ActualitePage.doSetAction(publication, actionDo, 1);
      } else if (oldReaction === actionDo) {
        ActualitePage.doSetAction(publication, actionDo, -1);
        publication.reaction = "NoAction";
      } else {
        ActualitePage.doSetAction(publication, oldReaction, -1);
        ActualitePage.doSetAction(publication, actionDo, 1);
      }
      this.sendReaction(this.service.messageReaction(publication));
      this.service.action(ActualitePage.curUser.personneId, publication.publicationId, actionDo)
        .then(actionFetched => {
          if (actionFetched.erreur) {
            this.doAlert("Il y a une erreur", actionFetched.object);
          }
        });
    }
  }

  public doSuggerer(publication: any) {
    let suggestion = this.modalCtrl.create(Suggestion, publication);
    suggestion.present();
  }

  public doPartage(publication: any) {
    let partage = this.modalCtrl.create(Partage, publication);
    partage.present();
  }

  listCommantaires(publication: any) {
    let commentaires = this.modalCtrl.create(Listcommentaires, publication);
    commentaires.present();
  }

  listSuggestions(publication: any) {
    let suggestions = this.modalCtrl.create(Listsuggestions, publication);
    suggestions.present();
  }

  goToProfile(personneId:string){
    let profile;
    console.log(personneId + " " + ActualitePage.curUser.personneId);
    if(personneId === ActualitePage.curUser.personneId) {
      profile = this.modalCtrl.create(Profile, {personneId: personneId});
    }else{
      profile = this.modalCtrl.create(VoirprofilePage, {personneId: personneId});
    }
    profile.present();
  }

  public doSendCommentaire(publication: any): void {
    if (this.message !== "" && this.message !== undefined) {
      let comment = this.message;
      this.message = "";
      let aCommentaire = new CommentaireModel(
        publication.publicationId,
        publication.publicationId,
        ActualitePage.curUser.personneId,
        ActualitePage.curUser.nomComplet,
        comment,
        ObjectService.now()
      );
      ActualitePage.upCommentaireLocal(publication, comment);
      this.sendACommentaire(publication);
      this.sendSocketCommentaire(JSON.stringify(aCommentaire));
    }
  }

  addAsFavoris(publication: any) {
    let menu = new Addstyles(this.platform, this.actionSheetCtrl, this.toastCtrl);
    menu.openFromActualite(this.service, ActualitePage.curUser.personneId, publication);
  }

  doRefresh(refresher) {
    refresher.complete();
    this.actualites();
  }

  private actualites() {
    this.loadData();
    this.service.getFilActualite(ActualitePage.curUser.personneId).then(actualiteFetched => {
      this.loading.dismissAll();
      if (actualiteFetched.erreur) {
        this.doAlert("Il y a une erreur", actualiteFetched.object);
      } else {
        let taille = actualiteFetched.object.length;
        for (let i = 0; i < taille; i++) {
          let val = ActualitePage.valeur(actualiteFetched.object[i].publication.reaction);
          actualiteFetched.object[i].publication.bouttonAdorer = "info-out-line";
          actualiteFetched.object[i].publication.bouttonAimer = "info-out-line";
          actualiteFetched.object[i].publication.bouttonDetester = "info-out-line";
          if (val === 1) {
            actualiteFetched.object[i].publication.bouttonAdorer = "info-in-line";
          } else if (val === 2) {
            actualiteFetched.object[i].publication.bouttonAimer = "info-in-line";
          } else if (val === 3) {
            actualiteFetched.object[i].publication.bouttonDetester = "info-in-line";
          }
          actualiteFetched.object[i].publication.existLastCommentaire = actualiteFetched.object[i].publication.lastCommentaire.publicationId !== undefined;
        }
        this.filActualites = actualiteFetched.object;
      }
        console.log(this.filActualites);

    }).catch(erreur => this.doAlert("Erreur de la Connection", "Aucune connection à Internet"));
  }

  private sendReaction(publicationInfo: any): void {
    this.stompClient.send("/actualite/lifestyles/reactions", {}, publicationInfo);
  }

  private sendSocketCommentaire(commentaireInfo: string): void {
    this.stompClient.send("/actualite/lifestyles/commentaires", {}, commentaireInfo);
  }

  private initSocket(): void {
    let ws = new SockJS(ObjectService.serverURL);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe("/publication/reaction", (message) => {
        if (message) {
          let pub = JSON.parse(message.body);
          let taille = that.filActualites.length;
          for (let i = 0; i < taille; i++) {
            let aPub = that.filActualites[i];
            if (aPub.publicationId === pub.publicationId) {
              aPub.adorer = pub.adorer;
              aPub.aimer = pub.aimer;
              aPub.detester = pub.detester;
              aPub.nbCommentaire = pub.nbCommentaire;
              aPub.nbSuggestion = pub.nbSuggestion;
              that.filActualites[i] = aPub;
              break;
            }
          }
        }
      });
    });
  }

  private sendACommentaire(publication: any): void {
    this.sendReaction(this.service.messageReaction(publication));
  }
}
