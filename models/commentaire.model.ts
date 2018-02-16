export class CommentaireModel {
  commentaireId: string;
  publicationId: string;
  personneId: string;
  personneNom: string;
  commentaire: string;
  commentaireDate: string;

  constructor(commentaireId: string, publicationId: string, personneId: string, personneNom: string, commentaire: string, commentaireDate: string) {
    this.commentaireId = commentaireId;
    this.publicationId = publicationId;
    this.personneId = personneId;
    this.personneNom = personneNom;
    this.commentaire = commentaire;
    this.commentaireDate = commentaireDate;
  }
}
