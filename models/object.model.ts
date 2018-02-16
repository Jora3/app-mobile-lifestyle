export class ObjectModel {
  erreur: boolean;
  object: string;

  public constructor(erreur: boolean, object: string) {
    this.erreur = erreur;
    this.object = object;
  }
}
