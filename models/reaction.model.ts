export class ReactionModel {
  publicationId: string;
  adorer: number;
  aimer: number;
  detester: number;
  nbCommentaire: number;
  nbSuggestion: number;

  public constructor(publicationId: string, adorer: number, aimer: number, detester: number, commentaire: number, suggerer: number) {
    this.publicationId = publicationId;
    this.adorer = adorer;
    this.aimer = aimer;
    this.detester = detester;
    this.nbCommentaire = commentaire;
    this.nbSuggestion = suggerer;
  }
}
