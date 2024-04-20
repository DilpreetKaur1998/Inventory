import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private sharedData: any;

  constructor(private http: HttpClient) { }
  setData(data: any) {
    this.sharedData = data;
    console.log("userData in set service:", this.sharedData)
  }

  getData() {
    console.log("userData in get service", this.sharedData)
    return this.sharedData;
  }

  createUser(req: any){
    return this.http.post(environment.CREATE_USER, req);
  }
  uploadPhoto(formData: any){
    return this.http.put(environment.UPLOAD_IMAGE,formData);
  }
  getAllUsers(){
    return this.http.get(environment.GET_ALL_USERS);
  }
  getSingleUser(userId: string){
    return this.http.get(environment.GET_SINGLE_USER+'?'+'userId='+userId);
  }

  deleteUser(userId: string){
    return this.http.delete(environment.DELETE_USER+'?'+'userId='+userId)
  }

  updateStatus(userId: string, status: string) {
    return this.http.put(environment.UPDATE_STATUS + `?userId=${userId}&status=${status}`, {});
  }

 updateUser(req:any){
    return this.http.put(environment.UPDATE_USER, req);
 }
 savePrivileges(req: any){
    return this.http.post(environment.SAVE_PRIVILEGES, req);
 }
 getPrivileges(userId: any){
    return this.http.get(environment.GET_PRIVILEGES+'?userId='+userId)
 }
  updatePrivileges(id: any, data: any): Observable<any> {
    return this.http.put(environment.PUT_PRIVILEGES, data);
  }
  // getImage(id:any){
  //   return this.http.get(environment.GET_IMAGE+'?userId='+id);
  // }

  getImage(userId: any): Observable<Blob> {
    return this.http.get(environment.GET_IMAGE + '?userId=' + userId, { responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching image:', error);
          return throwError('Error fetching image. Please try again.');
        })
      );
  }


  getDataWithPagination(req:any, page:any, size:any) {
    return this.http.post<any>(`${environment.SEARCH}?page=${page}&size=${size}&sort=userId&direction=ASC`,req );

  }
}
