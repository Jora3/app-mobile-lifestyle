import {InfoaddresseModel} from "./infoaddresse.model";

export class InfoclientModel {
  personneId: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  password: string;
  infoAddress: InfoaddresseModel;

  constructor(){}
}
