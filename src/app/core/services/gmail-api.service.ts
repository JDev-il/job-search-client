import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from './configuration.service';

@Injectable({ providedIn: 'root' })
export class GmailApiService {

  constructor(private apiConfig: ApiConfigService, private http: HttpClient) { }

  public getGmailStatusReq(token: string): Observable<{ gmailEmail: string | null }> {
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.gmailStatus);
    return this.http.get<{ gmailEmail: string | null }>(url, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  public gmailConnectReq(token: string): Observable<{ url: string }> {
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.gmailUrl);
    return this.http.get<{ url: string }>(url, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  public disconnectGmailReq(token: string): Observable<void> {
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.gmailDisconnect);
    return this.http.delete<void>(url, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  public postGmailConsentReq(token: string, accepted: boolean): Observable<{ gmailConsent: boolean }> {
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.gmailConsent);
    return this.http.post<{ gmailConsent: boolean }>(url, { accepted }, {
      headers: { authorization: `Bearer ${token}` }
    });
  }
}
