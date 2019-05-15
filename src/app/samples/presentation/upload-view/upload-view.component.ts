import { Component, OnInit } from '@angular/core';
import * as samplesActions from '../../state/samples.actions';
import * as coreActions from '../../../core/state/core.actions';
import { Store } from '@ngrx/store';
import { UserActionType } from '../../../shared/model/user-action.model';
import { Samples } from '../../samples.store';

@Component({
    selector: 'mibi-upload-view',
    templateUrl: './upload-view.component.html',
    styleUrls: ['./upload-view.component.scss']
})
export class UploadViewComponent implements OnInit {
    constructor(
        private store: Store<Samples>) { }

    ngOnInit(): void {
        this.store.dispatch(new coreActions.EnableActionItems(
            [
                UserActionType.VALIDATE,
                UserActionType.SEND,
                UserActionType.EXPORT,
                UserActionType.UPLOAD,
                UserActionType.DOWNLOAD_TEMPLATE
            ]));
    }
    // Container not really necessary here, or is it?
    fileUpload(file: File) {
        this.store.dispatch(new samplesActions.ImportExcelFile({ file }));
    }
}
