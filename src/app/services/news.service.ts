import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsResponse, ArticlesByCategoryAndPage } from '../interfaces';
import { Article } from '../interfaces';

import {map} from 'rxjs/operators'

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private ArticlesByCategoryAndPage : ArticlesByCategoryAndPage = {}


  constructor(private http:HttpClient) { }

  getTopHeadLines(): Observable<Article[]>{


    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`,{
      params: {
        apiKey: apiKey
      }
    }).pipe(
        map( ({articles}) => articles)
    );
  }

  getTopHeadLinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]>{

    if(loadMore){
      return this.getArticlesByCategory(category);
    }

    if(this.ArticlesByCategoryAndPage[category]){
      return of(this.ArticlesByCategoryAndPage[category].articles);
    }


   return this.getArticlesByCategory(category);

  }

  private getArticlesByCategory(category:string): Observable<Article[]>{

    if(Object.keys(this.ArticlesByCategoryAndPage).includes(category)){
      //this.ArticlesByCategoryAndPage[category].page +=0;
    }else{
      this.ArticlesByCategoryAndPage[category]={
        page: 0,
        articles:[]
      }
    }
  
    const page = this.ArticlesByCategoryAndPage[category].page + 1  ;

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}`,{
      params: {
        apiKey: apiKey
      }
    }).pipe(
      map(( {articles}) => {

        if(articles.length ===0 )return this.ArticlesByCategoryAndPage[category].articles;

        this.ArticlesByCategoryAndPage[category] = {
          page:page,
          articles: [...this.ArticlesByCategoryAndPage[category].articles, ...articles]
        }

        return this.ArticlesByCategoryAndPage[category].articles;  
      })
    );
  }


  

}

