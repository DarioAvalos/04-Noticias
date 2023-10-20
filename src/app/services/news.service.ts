import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const apiKey = environment.apikey;
export const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private ArticlesByCategoryAndPage: ArticlesByCategoryAndPage = {

  }

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

    return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
      .pipe (
        map( ({ articles }) => articles )
      );
  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ):Observable<Article[]>{

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }`)
      .pipe (
        map( ({ articles }) => articles )
      );
  }

  private getArticlesByCategory( category: string ): Observable<Article[]>{

    if (Object.keys( this.ArticlesByCategoryAndPage ).includes(category)){
      // Ya existe
      // this.ArticlesByCategoryAndPage[category].page += 0;
    }else {
      // No existe
      this.ArticlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.ArticlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe (
      map( ({ articles }) => articles )
    );

  }

}