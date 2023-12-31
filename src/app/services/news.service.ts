import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { storedArticlesByCategory } from '../data/mock-news';

export const apiKey = environment.apikey;
export const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage | any = storedArticlesByCategory;

  constructor(private http: HttpClient) { }

  private executeQuery<T>( endpoint: string){
    console.log('Petici[on HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`,{
      params: {
        apiKey: apiKey,
        country: 'us',
      }
    })
  }

  getTopHeadlines(): Observable<Article[]> {

    return this.getTopHeadlinesByCategory('business');

    // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    //   .pipe (
    //     map( ({ articles }) => articles )
    //   );
  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ):Observable<Article[]>{

    return of(this.articlesByCategoryAndPage[category].articles);

    if( loadMore ){
      return this.getArticlesByCategory( category );
    }

    if( this.articlesByCategoryAndPage[category] ){
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory( category );

  }

  private getArticlesByCategory( category: string ): Observable<Article[]>{

    if (Object.keys( this.articlesByCategoryAndPage ).includes(category)){
      // Ya existe
      // this.ArticlesByCategoryAndPage[category].page += 0;
    }else {
      // No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe (
      map( ({ articles }) => {

        if ( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles ]
        }

        return this.articlesByCategoryAndPage[category].articles;
      })
    );

  }

}