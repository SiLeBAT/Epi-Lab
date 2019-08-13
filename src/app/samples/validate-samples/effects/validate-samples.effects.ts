import { Injectable } from '@angular/core';
import {
    ValidateSamplesAction,
    ValidateSamples,
    ValidateSamplesActionTypes,
    ValidateSamplesSuccess,
    ValidateSamplesFailure
} from '../state/validate-samples.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, concatMap, map, catchError } from 'rxjs/operators';
import { DataService } from '../../../core/services/data.service';
import { SampleData } from '../../model/sample-management.model';
import { of, Observable } from 'rxjs';
import { DisplayBanner } from '../../../core/state/core.actions';
import { LogService } from '../../../core/services/log.service';
import { Samples } from '../../samples.store';
import * as _ from 'lodash';
import { selectSamplesMainData } from '../../state/samples.reducer';

@Injectable()
export class ValidateSamplesEffects {

    constructor(
        private actions$: Actions<ValidateSamplesAction>,
        private dataService: DataService,
        private logger: LogService,
        private store$: Store<Samples>
    ) { }

    @Effect()
    validateSamples$: Observable<ValidateSamplesSuccess | ValidateSamplesFailure | DisplayBanner> = this.actions$.pipe(
        ofType<ValidateSamples>(ValidateSamplesActionTypes.ValidateSamples),
        withLatestFrom(this.store$),
        concatMap(([, state]) => {
            const sampleData = selectSamplesMainData(state);
            return this.dataService.validateSampleData(sampleData).pipe(
                map((annotatedSamples: SampleData[]) => {
                    return new ValidateSamplesSuccess(annotatedSamples);
                }),
                catchError((error) => {
                    this.logger.error('Failed to validate samples', error);
                    return of(
                        new ValidateSamplesFailure(),
                        new DisplayBanner({ predefined: 'validationFailure' })
                    );
                })
            );
        })
    );
}