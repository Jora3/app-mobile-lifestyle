import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {ActualitePage} from '../pages/actualite/actualite';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HttpModule} from '@angular/http';
import {Suggestion} from "../pages/suggestion/suggestion";
import {Partage} from "../pages/partage/partage";
import {Listcommentaires} from "../pages/listcommentaires/listcommentaires";
import {Listsuggestions} from "../pages/listsuggestions/listsuggestions";
import {HomePage} from "../pages/home/home";
import {Mysuggestion} from "../pages/mysuggestion/mysuggestion";
import {Addstyles} from "../pages/addstyles/addstyles";
import {Profile} from "../pages/profile/profile";
import {Choixconfidence} from "../pages/confidence/choixconfidence";
import {Login} from "../pages/login/login";
import {Inscription} from "../pages/inscription/inscription";
import {Infoclient} from "../pages/infoclient/infoclient";
import {Nouvelles} from "../pages/nouvelles/nouvelles";
import {VoirprofilePage} from "../pages/voirprofile/voirprofile";

@NgModule({
  declarations: [
    MyApp,
    Login,
    Inscription,
    Infoclient,
    HomePage,
    Profile,
    Addstyles,
    VoirprofilePage,
    Mysuggestion,
    ActualitePage,
    Suggestion,
    Nouvelles,
    Listcommentaires,
    Listsuggestions,
    Choixconfidence,
    Partage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Inscription,
    Infoclient,
    HomePage,
    Profile,
    Addstyles,
    VoirprofilePage,
    Mysuggestion,
    ActualitePage,
    Suggestion,
    Nouvelles,
    Listcommentaires,
    Listsuggestions,
    Choixconfidence,
    Partage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
