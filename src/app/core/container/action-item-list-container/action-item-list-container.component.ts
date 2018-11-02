import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import * as fromSamples from '../../../samples/state/samples.reducer';
import * as fromUser from '../../../user/state/user.reducer';
import * as fromCore from '../../state/core.reducer';
import { map } from 'rxjs/operators';
import { Observable, of, combineLatest } from 'rxjs';
import { ActionItemConfiguration, ActionItemType } from '../../model/action-items.model';
import { UserActionService } from '../../services/user-action.service';

@Component({
    selector: 'mibi-action-item-list-container',
    templateUrl: './action-item-list-container.component.html'
})
export class ActionItemListContainerComponent implements OnInit {

    config$: Observable<ActionItemConfiguration[]>;

    constructor(
        private store: Store<fromSamples.State>,
        private userActionService: UserActionService) { }

    ngOnInit() {
        this.config$ = combineLatest(of(this.userActionService.userActionConfiguration),
            this.store.pipe(select(fromCore.getEnabledActionItems)),
            this.store.pipe(select(fromSamples.hasEntries)),
            this.store.pipe(select(fromUser.getCurrentUser)),
            this.store.pipe(select(fromCore.isBusy))).pipe(
                map(combined => {

                    const [configuration, enabled, hasEntries, currentUser, isBusy] = combined;
                    let newConfig = [...configuration];
                    if (!hasEntries || !enabled.length || isBusy) {
                        newConfig = [];
                    }
                    if (!currentUser) {
                        newConfig = _.filter(newConfig, (c: ActionItemConfiguration) => c.type !== ActionItemType.SEND);

                    }
                    if (enabled.length) {
                        newConfig = _.filter(newConfig, (c: ActionItemConfiguration) => {
                            return _.includes(enabled, c.type);
                        });
                    }
                    return newConfig;
                })
            );
    }
}