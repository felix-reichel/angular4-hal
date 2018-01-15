import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, InjectionToken} from '@angular/core';

export let API_URI = new InjectionToken('api.uri');
export let PROXY_URI = new InjectionToken('proxy.uri');

@Injectable()
export class ExternalService {

    constructor(@Inject(API_URI) public root_uri: string,
                @Inject(PROXY_URI) public proxy_uri: string,
                private http: HttpClient) {
    }

    public getURL(): string {
        return this.proxy_uri ? this.proxy_uri : this.root_uri;
    }

    public getHttp(): HttpClient {
        return this.http;
    }
}