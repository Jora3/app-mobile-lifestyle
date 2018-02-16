export class InfoaddresseModel {
  infoAddresseId: string;
  pays: string;
  ville: string;
  lieu: string;
  mails: string;
  mobiles: string;

  constructor(id: string, pays: string, ville: string, lieu: string, mails: string, mobiles: string) {
    this.infoAddresseId = id;
    this.pays = pays;
    this.ville = ville;
    this.lieu = lieu;
    this.mails = mails;
    this.mobiles = mobiles;
  }
}
