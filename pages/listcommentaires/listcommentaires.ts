import {Component} from "@angular/core";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";
import {AlertController, NavParams} from "ionic-angular";
import {ActualitePage} from "../actualite/actualite";
import {CommentaireModel} from "../../models/commentaire.model";
import {ObjectService} from "../../services/object.service";
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'page-listcommentaires',
  templateUrl: 'listcommentaires.html'
})
export class Listcommentaires {
  service: ActualiteService;
  nombreCommentaires: number;
  commentaires: any;
  stompClient: any;
  publication: any;
  message: any;
  curUser: any;


  constructor(public http: Http,
              public params: NavParams,
              public alertCtrl: AlertController) {
    this.curUser = ObjectService.getCurUser();
    console.log(this.curUser);
    this.service = new ActualiteService(http);
    this.publication = params.data;
    this.commentairesList();
    this.initSocket();
  }

  doSendCommentaire(): void {
    if (this.message !== "" && this.message !== undefined) {
      let comment = this.message;
      this.message = "";
      this.nombreCommentaires = this.nombreCommentaires + 1;
      ActualitePage.upCommentaireLocal(this.publication, comment);
      this.sendSocketCommentaire(this.upCommentaire(this.curUser.personneId, this.curUser.nomComplet, comment));
    }
  }

  doRefresh(refresher) {
    this.commentaires = null;
    refresher.complete();
    this.commentairesList();
  }

  private doAlert(titre: string, message: string): void {
    let alert = this.alertCtrl.create({
      title: titre,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  private initSocket(): void {
    let ws = new SockJS(ObjectService.serverURL);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe("/publication/commentaire/" + that.publication.publicationId, (message) => {
        if (message) {
          let nouveauCommentaire = JSON.parse(message.body);
          if (nouveauCommentaire.personneId !== that.curUser.personneId) {
            that.commentaires.push(nouveauCommentaire);
            ActualitePage.upCommentaireRemote(that.publication, nouveauCommentaire);
          }
        }
      });
    });
  }

  private sendSocketCommentaire(commentaireInfo: string): void {
    this.stompClient.send("/actualite/lifestyles/commentaires", {}, JSON.stringify(commentaireInfo));
  }

  private commentairesList(): any {
    this.service.commentairesList(this.publication.publicationId).then(commentairesFetched => {
      if (commentairesFetched.erreur) {
        this.doAlert("Il y a une erreur.", commentairesFetched.object);
      } else {
        this.commentaires = commentairesFetched.object;
        this.nombreCommentaires = commentairesFetched.object.length;
      }
    }).catch(erreur => this.doAlert("Connexion perdu.", "Verifier votre connexion."));
  }

  private upCommentaire(personneId: string, personneNom: string, commentaire: string) {
    let comment = new CommentaireModel(
      this.publication.publicationId, this.publication.publicationId, personneId, personneNom, commentaire, ObjectService.now());
    let commentaireObject = JSON.parse(JSON.stringify(comment));
    this.commentaires.push(commentaireObject);
    return commentaireObject;
  }
}
