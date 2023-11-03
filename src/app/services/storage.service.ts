import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'
import { Article } from '../interfaces';
 
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _LocalArticles: Article[] = [];

  constructor( private storage: Storage ) { 
    this.init();
  }

  get getLocalArticles(){
    return [ ...this._LocalArticles ]
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }

  async saveRemoveArticle( article: Article ) {

    const exists = this._LocalArticles.find( localArticle => localArticle.title === article.title);

    if ( exists ) {
      this._LocalArticles = this._LocalArticles.filter( localArticle => localArticle.title !== article.title );
    } else {
      this._LocalArticles = [ article, ...this._LocalArticles];
    }

    this._storage?.set('articles', this._LocalArticles);

  }

  async loadFavorites(){
    try {

      const articles = await this._storage?.get('articles');
      this._LocalArticles = articles || [];

    } catch (error){

    }
  }


  articleInFavorite( article: Article){

    return !!this._LocalArticles.find( localArticle => localArticle.title === article.title );
    
  }

}
