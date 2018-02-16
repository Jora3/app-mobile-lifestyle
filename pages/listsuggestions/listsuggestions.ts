import {Component} from "@angular/core";
import {ActualiteService} from "../../services/actualite.service";
import {Http} from "@angular/http";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-listsuggestion',
  templateUrl: 'listsuggestions.html'
})
export class Listsuggestions {
  service: ActualiteService;
  suggestions: any;
  publication: any;
  information: string;

  constructor(http: Http, params: NavParams) {
    this.service = new ActualiteService(http);
    this.publication = params.data;
    this.suggestionsList();
  }

  doRefresh(refresher) {
    this.suggestions = null;
    this.information = null;
    refresher.complete();
    this.suggestionsList();
  }

  private suggestionsList() {
    this.service.suggestionsList(this.publication.publicationId).then(suggestionsFetched => {
      if (suggestionsFetched.erreur) {
        console.log(suggestionsFetched.object);
      } else {
        if (suggestionsFetched.object.length == 0) this.information = "Aucune suggestion à afficher";
        this.suggestions = suggestionsFetched.object;
      }
    }).catch(erreur => console.log(erreur));
  }
}
