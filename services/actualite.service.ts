import {Http} from "@angular/http";
import {ObjectService} from "./object.service";
import {ReactionModel} from "../models/reaction.model";

export class ActualiteService {
  private object: ObjectService;

  constructor(private http: Http) {
    this.object = new ObjectService();
  }

  public messageReaction(publication: any) {
    let reaction = new ReactionModel(
      publication.publicationId,
      publication.adorer,
      publication.aimer,
      publication.detester,
      publication.nbCommentaire,
      publication.nbSuggestion
    );
    return JSON.stringify(reaction);
  }

  public mesPublication(personneId:string){
    return this.object.getObject(this.http, "PublicationSClient", "mesPublications/"+personneId);
  }

  public addAmis(personneId1:string, personneId2){
    return this.object.getObject(this.http, "ClientProfileSClient", "addAmis/" + personneId1 + "/" + personneId2);
  }

  public chekAccountMail(addresse: string) {
    return this.object.getObject(this.http, "ClientProfileSClient", "checkAccount/" + addresse);
  }

  public doInscription(infoPersonne: string) {
    return this.object.getObject(this.http, "ClientProfileSClient", "inscription/" + infoPersonne);
  }

  public getInformationLogin(addresse: string, password: string) {
    return this.object.getObject(this.http, "ClientProfileSClient",
      "login/" + addresse + "/" + password);
  }

  public getFilActualite(personneId: string): Promise<any> {
    return this.object.getObject(this.http, "ActualiteSClient", "actualites/" + personneId);
  }

  public action(personneId: string, publicationId: string, action: string) {
    return this.object.getObject(this.http, "PublicationSClient",
      "doAction/" + personneId + "/" + publicationId + "/" + action);
  }

  public amis(personneId: string) {
    return this.object.getObject(this.http, "ClientProfileSClient", "listAmis/" + personneId);
  }

  public suggestionPersonnes(personneId:string){
    return this.object.getObject(this.http, "ClientProfileSClient", "personnesSuggerer/" + personneId);
  }

  public amisASuggerer(personneId: string, publicationId: string) {
    return this.object.getObject(this.http, "ClientProfileSClient",
      "listAmisASuggerer/" + personneId + "/" + publicationId);
  }

  public partage(security: string, personneId: string, publicationId: string) {
    return this.object.getObject(this.http, "ActualiteSClient",
      "partager/" + security + "/" + personneId + "/" + publicationId);
  }

  public suggerer(do_action: string, personneId1, publicationId, personneId2) {
    return this.object.getObject(this.http, "ActualiteSClient",
      do_action + "/" + personneId1 + "/" + publicationId + "/" + personneId2);
  }

  public commentairesList(publicationId: string) {
    return this.object.getObject(this.http, "PublicationSClient",
      "commentaires/" + publicationId);
  }

  public suggestionsList(publicationId: string) {
    return this.object.getObject(this.http, "ActualiteSClient",
      "listSuggerer/" + publicationId);
  }

  public mySuggestionsList(personneId: string) {
    return this.object.getObject(this.http, "ActualiteSClient",
      "suggestions/" + personneId);
  }

  public deleteSuggestion(personneId: any, suggestionId: any) {
    return this.object.getObject(this.http, "ClientProfileSClient",
      "deleteSuggestion/" + personneId + "/" + suggestionId);
  }

  public addInMystyles(personneId: any, publicationId: any, confidence: any) {
    return this.object.getObject(this.http, "ClientProfileSClient",
      "addInMystyles/" + personneId + "/" + publicationId + "/" + confidence)
  }

  public listMystyles(personneId: any) {
    return this.object.getObject(this.http, "ClientProfileSClient", "listMIStyles/" + personneId);
  }

  public voirMystyles(personneId: string, visiteurId: string){
    return this.object.getObject(this.http, "ClientProfileSClient", "voirMIStyles/" + personneId + "/" + visiteurId);
  }

  public updateConfidenceMIStyle(personneId: string, mistyleId: string, confidence: string) {
    return this.object.getObject(this.http, "ClientProfileSClient",
      "updateSecurityMIStyle/" + personneId + "/" + mistyleId + "/" + confidence);
  }

  public getNouvelles(personneId:string){
    return this.object.getObject(this.http,"ActualiteSClient", "nouvelles/"+personneId);
  }

  public getPersonneInfo(personneIdInfo:string, personneId1){
    return this.object.getObject(this.http, "ClientProfileSClient",
      "infoPersonne/"+personneIdInfo+"/"+personneId1);
  }
}
