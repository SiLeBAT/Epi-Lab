import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CommentDialogAction, CommentDialogActionTypes } from '../state/comment-dialog.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentDialogComponent } from '../container/comment-dialog.component';
import { DialogService } from '../../dialog/services/dialog.service';

@Injectable()
export class CommentDialogEffects {

    constructor(private actions$: Actions<CommentDialogAction>,
        private dialogService: DialogService) { }

    @Effect({ dispatch: false })
    commentDialogOpen$: Observable<void> = this.actions$.pipe(
        ofType(CommentDialogActionTypes.CommentDialogOpen),
        map(() => this.dialogService.openDialog(CommentDialogComponent))
    );
}