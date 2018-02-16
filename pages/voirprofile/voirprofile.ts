import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ObjectService} from "../../services/object.service";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";

/**
 * Generated class for the VoirprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voirprofile',
  templateUrl: 'voirprofile.html',
})
export class VoirprofilePage {

  service: ActualiteService;
  information: any;
  curUser:any;
  utilisateur:any;

  isFavoris : boolean;
  isAbonnes : boolean;
  isAmis : boolean;
  isPublie : boolean;

  isSuggestion :boolean;

  mistyles: any;
  listAmis: any;
  listAbonnes : any;
  listPublications :any;

  constructor(public navParams: NavParams,
              public popover: PopoverController,
              public http: Http) {
    this.isFavoris = true;
    this.service = new ActualiteService(this.http);
    this.curUser = ObjectService.getCurUser();
    this.utilisateur = ObjectService.getCurUser();
    this.getUser();
  }

  getUser(){
    this.service.getPersonneInfo(this.navParams.get("personneId"), this.curUser.personneId)
      .then(personneinfoFetched =>{
        if(personneinfoFetched.erreur) {
          this.information = personneinfoFetched.object;
        }else{
          this.utilisateur = personneinfoFetched.object;
          this.doGetListmistyles();
        }
      });
  }

  getConfidence(style: any): string {
    if (style.security.publics) return "public";
    if (style.security.amisEtSesAmis) return "entre amis et ses amis";
    if (style.security.entreAmis) return "entre amis";
    if (style.security.prive) return "moi uniquement";
  }

  doRefresh(refresher) {
    this.mistyles = null;
    this.information = null;
    refresher.complete();
    this.doGetListmistyles();
  }

  doGetListmistyles() {
    this.mistyles = null;
    this.information = null;
    this.service.voirMystyles(this.utilisateur.personneId, this.curUser.personneId).then(
      listmistylesFetched => {
        if (listmistylesFetched.erreur) {
          this.information = listmistylesFetched.erreur;
        } else {
          if (listmistylesFetched.length == 0)
            this.information = "Aucun style a afficher pour le moment.";
          this.mistyles = listmistylesFetched.object;
        }
      }
    );
  }

  doGetListAmis(){
    this.isSuggestion = false;
    this.information = null;
    this.listAmis = null;
    this.service.amis(this.curUser.personneId).then(
      listamis => {
        if (listamis.erreur) {
          this.information = listamis.erreur;
        } else {
          if (listamis.length === 0)
            this.information = "Aucun amis afficher pour le moment.";
          else this.listAmis = listamis.object;
        }
      }
    );
  }

  doGetMesPublication(){
    this.information = null;
    this.service.mesPublication(this.curUser.personneId).then(mespublicationFetched =>{
      if(mespublicationFetched.erreur){
        this.information = mespublicationFetched.object;
      }else{
        if(mespublicationFetched.object.length === 0) this.information = "Ajouter des styles propres à vous et partager";
        else this.listPublications = mespublicationFetched.object;
      }
    })
  }

  private setBar(fav:boolean, abo:boolean, ami:boolean, pub:boolean){
    this.isFavoris = fav; this.isAbonnes = abo; this.isAmis = ami; this.isPublie = pub;
    let botton1 = document.getElementById("FAVORIS");
    let botton2 = document.getElementById("ABONNE");
    let botton3 = document.getElementById("AMIS");
    let botton4 = document.getElementById("PUBLIE");

    if(!fav) botton1.setAttribute("class", "p-p");
    else botton1.setAttribute("class", "p-p p-inline");

    if (abo) botton2.setAttribute("class", "p-p p-inline");
    else botton2.setAttribute("class", "p-p");

    if (ami) botton3.setAttribute("class", "p-p p-inline");
    else botton3.setAttribute("class", "p-p");

    if (pub) botton4.setAttribute("class", "p-p p-inline");
    else botton4.setAttribute("class", "p-p");
  }

  favoris(){
    this.setBar(true, false, false, false);
  }

  abonnes(){
    this.setBar(false, true, false, false);
  }

  amis(){
    this.setBar(false, false, true, false);
    this.doGetListAmis();
  }

  publie(){
    this.setBar(false, false, false, true);
    this.doGetMesPublication();
  }

  private doAction(aBoutton: HTMLElement, set_boutton: string, set_boutton_name: string, ami:any): void {
    aBoutton.setAttribute("class", set_boutton);
    aBoutton.innerText = "...";
    this.curUser.nombreAmis += 1;
    this.service.addAmis(this.curUser.personneId, ami.personneId).then(addamisFetched =>{
      if (addamisFetched.erreur) {
        this.information = addamisFetched.object;
      } else {
        aBoutton.innerText = set_boutton_name;
      }
    });
  }

  doAjouter(ami){
    let boutton = document.getElementById(ami.personneId);
    if (boutton.innerText === "Ajouter") {
      this.doAction(boutton, "boutton-annulation", "Envoyé", ami);
    }
  }
}
