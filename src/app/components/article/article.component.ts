import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Article } from '../../interfaces';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: any;
  @Input() index: any;
  
  constructor( 
    // private iab: InAppBrowser,
    private platform: Platform
    ) { }

  openArticle() {

    if ( this.platform.is('ios') || this.platform.is('android')){
      const openCapacitorSite = async () => {
        await Browser.open( this.article.url );
      };
    };

     // if ( this.platform.is('ios') || this.platform.is('android')){
     //   const browser = this.iab.create( this.article.url );
     //   browser.show();
     //   return;
     // }
    
   window.open( this.article.url, '_blank')

   }

  onClick(){}

}
