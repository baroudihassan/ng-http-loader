/*
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Injectable } from '@angular/core';
import {
    ConnectionBackend,
    Http,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    XHRBackend
} from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';

/**
 * @deprecated Prefer the new HttpClientModule.
 * From 4.3, Http interceptors are built in.
 *
 * The next release of ng-http-loader will require angular ^4.3.0.
 * Please upgrade !
 *
 * @see https://angular.io/guide/http
 */
@Injectable()
export class HttpInterceptorService extends Http {
    private _pendingRequests = 0;
    private _pendingRequestsStatus: Subject<boolean> = new Subject<boolean>();

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    get pendingRequestsStatus(): Observable<boolean> {
        return this._pendingRequestsStatus.asObservable();
    }

    get pendingRequests(): number {
        return this._pendingRequests;
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        this._pendingRequests++;

        if (1 === this._pendingRequests) {
            this._pendingRequestsStatus.next(true);
        }

        return super.request(url, options)
            .map(result => {
                return result;
            })
            .catch(error => {
                return Observable.throw(error);
            })
            .finally(() => {
                this._pendingRequests--;

                if (0 === this._pendingRequests) {
                    this._pendingRequestsStatus.next(false);
                }
            });
    }
}

/**
 * @deprecated Prefer the new HttpClientModule.
 * From 4.3, Http interceptors are built in.
 *
 * The next release of ng-http-loader will require angular ^4.3.0.
 * Please upgrade !
 *
 * @see https://angular.io/guide/http
 */
export function HttpInterceptorServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
    return new HttpInterceptorService(backend, defaultOptions);
}

/**
 * @deprecated Prefer the new HttpClientModule.
 * From 4.3, Http interceptors are built in.
 *
 * The next release of ng-http-loader will require angular ^4.3.0.
 * Please upgrade !
 *
 * @see https://angular.io/guide/http
 */
export let HttpInterceptorServiceFactoryProvider = {
    provide: HttpInterceptorService,
    useFactory: HttpInterceptorServiceFactory,
    deps: [XHRBackend, RequestOptions],
};
