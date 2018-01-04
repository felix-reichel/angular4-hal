import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ResourceHelper} from './resource-helper';
import {Sort} from './sort';
import {ResourceArray} from './resource-array';

export abstract class Resource {

    static path: string;
    public http: HttpClient;
    public observable: Observable<any>;
    public _links: any;
    [index: string]: any;

    constructor() {
    }

    // Get collection of related resources

    public getAll<T extends Resource>(type: { new(): T }, relation: string, options?: {
        size?: number, sort?: Sort[],
        params?: [{ key: string, value: string | number }]
    }): Observable<ResourceArray<T>> {

        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(this.http);
        result.observable = this.http.get(this._links[relation].href, {params: params});
        return result.observable.map(response => ResourceHelper.instantiateResourceCollection<T>(type, response, result));
    }

    // Get related resource

    public get<T extends Resource>(type: { new(): T }, relation: string): Observable<T> {
        const result: T = new type();
        result.observable = this.http.get(this._links.relation.href);
        return result.observable.map(data => ResourceHelper.instantiateResource(result, data, this.http));
    }

    // Bind the given resource to this resource by the given relation

    public bind<T extends Resource>(resource: T): Observable<any> {
        return this.http.put(this._links.relation.href, resource._links.self.href);
    }


    // Unbind the resource with the given relation from this resource

    public unbind(relation: string): Observable<any> {
        return this.http.delete(this._links.relation.href);
    }

    // Adds the given resource to the bound collection by the relation

    public add<T extends Resource>(relation: string, resource: T): Observable<any> {
        return this.http.post(this._links[relation].href, resource._links.self.href,
            {headers: new HttpHeaders().set('Content-Type', 'text/uri-list')});
    }

}
