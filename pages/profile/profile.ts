import {Component} from "@angular/core";
import {PopoverController} from "ionic-angular";
import {Choixconfidence} from "../confidence/choixconfidence";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";
import {ObjectService} from "../../services/object.service";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {
  service: ActualiteService;
  information: any;
  curUser:any;

  isFavoris : boolean;
  isAbonnes : boolean;
  isAmis : boolean;
  isPublie : boolean;

  isSuggestion :boolean;

  mistyles: any;
  listAmis: any;
  listAbonnes : any;
  listPublications :any;

  constructor(public popover: PopoverController,
              public http: Http) {
    this.isFavoris = true;
    this.curUser = ObjectService.getCurUser();
    this.service = new ActualiteService(this.http);
    this.doGetListmistyles();
  }

  getConfidence(style: any): string {
    if (style.security.publics) return "public";
    if (style.security.amisEtSesAmis) return "entre amis et ses amis";
    if (style.security.entreAmis) return "entre amis";
    if (style.security.prive) return "moi uniquement";
  }

  showPopover(event, mistyle) {
    let choix = this.popover.create(Choixconfidence, mistyle);
    choix.present({
      ev: event
    });
  }

  doRefresh(refresher) {
    this.mistyles = null;
    this.information = null;
    refresher.complete();
    this.doGetListmistyles();
  }

  doGetListmistyles() {
    this.mistyles = null;
    this.service.listMystyles(this.curUser.personneId).then(
      listmistylesFetched => {
        if (listmistylesFetched.erreur) {
          this.information = listmistylesFetched.erreur;
        } else {
          if (listmistylesFetched.length == 0)
            this.information = "Les styles que vous allez ajouter apparaîtront ici.";
          this.mistyles = listmistylesFetched.object;
          console.log(listmistylesFetched.object);
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
            this.information = "Ajouter des personnes pour voir plus de styles";
          else this.listAmis = listamis.object;
        }
      }
    );
  }

  doGetSuggestionPersonnes(){
    this.information = null;
    this.listAmis = null;
    this.isSuggestion = true;
    this.service.suggestionPersonnes(this.curUser.personneId).then(
      listpersonnes => {
        if (listpersonnes.erreur) {
          this.information = listpersonnes.object;
        } else {
          if (listpersonnes.length === 0)
            this.information = "Suggerer l'application à vos amis. Ils pourront voir vos styles preférés";
          else{
            this.listAmis = listpersonnes.object;
          }
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


  setIconBarAmis(){
    this.amis();
    let botton1 = document.getElementById("ICONAMIS");
    let botton2 = document.getElementById("ICONADDS");
    botton1.setAttribute("class", "ion-personne info-in-line");
    botton2.setAttribute("class", "ion-add-personne  info-out-line");
  }

  setIconBarAddAmis(){
    this.doGetSuggestionPersonnes();
    let botton1 = document.getElementById("ICONAMIS");
    let botton2 = document.getElementById("ICONADDS");
    botton1.setAttribute("class", "ion-personne info-out-line");
    botton2.setAttribute("class", "ion-add-personne info-in-line");
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
