import {Component} from "@angular/core";
import {ActualitePage} from "../actualite/actualite";
import {Platform} from "ionic-angular";
import {Mysuggestion} from "../mysuggestion/mysuggestion";
import {Profile} from "../profile/profile";
import {Nouvelles} from "../nouvelles/nouvelles";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  actualitePage: any;
  suggFromAmis: any;
  suggFromStyles: any;
  profilePage: any;
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
    this.actualitePage = ActualitePage;
    this.suggFromAmis = Mysuggestion;
    this.suggFromStyles = Nouvelles;
    this.profilePage = Profile;
  }
}
