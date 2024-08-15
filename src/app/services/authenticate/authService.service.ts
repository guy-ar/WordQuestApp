import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegiaterUserRequest, RegisterUserResponse, User } from 'src/app/model/auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
 // private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserEmailSubject = new BehaviorSubject<string | null>(null);
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    // Check if there's a stored token or other auth info
    // and update isAuthenticatedSubject accordingly
  }

  
  login(credentials: AuthRequest) {
    // Implement login logic here
    // Update isAuthenticatedSubject on successful login
    const options = {
        headers: this.headers
    }
    return this.http.post<AuthResponse>(environment.apiUrl + 'auth', credentials, options)
    .pipe(
        tap(data => {
            if (data.success) {
                this.isAuthenticated = true;
                this.setToken(data.token);
                //this.isAuthenticatedSubject.next(true);
                this.currentUserEmailSubject.next(credentials.email);
            }
        })
    )
  }

  register(regiaterUserRequest: RegiaterUserRequest) {
    // Implement registration logic here

    const options = {
        headers: this.headers
    }
    return this.http.post<RegisterUserResponse>(environment.apiUrl + 'users/register-user', regiaterUserRequest, options)
  }

  get IsAuthenticated() {
    return this.isAuthenticated
  }

  // isAuthenticated(): Observable<boolean> {
  //   return this.isAuthenticatedSubject.asObservable();
  // }

  currentUserEmail(): Observable<string | null> {
    return this.currentUserEmailSubject.asObservable();
  }

  logout(): Promise<void> {
    // Implement logout logic here
    this.isAuthenticated = false;
    this.removeToken();
    //this.isAuthenticatedSubject.next(false);
    this.currentUserEmailSubject.next(null);
    return Promise.resolve();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}