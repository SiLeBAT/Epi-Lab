import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as fromUser from '../../state/user.reducer';
import * as coreActions from '../../../core/state/core.actions';
import { Store } from '@ngrx/store';
import { UserActivation } from '../../model/user.model';

@Component({
    selector: 'mibi-admin-activate-container',
    template: `<mibi-admin-activate
    [adminTokenValid]="adminTokenValid.activation"
    [name]="name"
    [appName]="appName"></mibi-admin-activate>`
})
export class AdminActivateContainerComponent implements OnInit {

    adminTokenValid: UserActivation;
    name: string;
    appName: string = environment.appName;
    constructor(private activatedRoute: ActivatedRoute,
        private store: Store<fromUser.UserMainState>) { }

    ngOnInit() {
        this.adminTokenValid = this.activatedRoute.snapshot.data['adminTokenValid'];

        if (this.adminTokenValid.activation) {
            this.name = this.adminTokenValid.username;
            this.store.dispatch(new coreActions.DisplayBanner({ predefined: 'accountActivationSuccess' }));
        } else {
            this.name = '';
            this.store.dispatch(new coreActions.DisplayBanner({ predefined: 'accountActivationFailure' }));
        }
    }
}
