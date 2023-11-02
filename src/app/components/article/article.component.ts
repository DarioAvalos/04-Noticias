import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Article } from '../../interfaces';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: any;
  @Input() index: any;
  nan: any;
  
  constructor( 
    // private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
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

  async onOpenMenu(){

    const normalBtns: ActionSheetButton[] =  [
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler: () => this.onToggleArticle()
      },
      {
        text:'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if ( this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    await actionSheet.present();

  }

  onShareArticle() {

    const { title, source, url } = this.article;

    this.socialSharing.share(
      title,
      source.name,
      this.nan,
      url
    );
  }

  onToggleArticle(){
    console.log('toggle Favorite');
  }

}
