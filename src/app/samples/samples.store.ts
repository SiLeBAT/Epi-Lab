import { ActionReducerMap } from '@ngrx/store';
import { SamplesMainEffects } from './samples.effects';
import { SamplesMainState, samplesMainReducer } from './state/samples.reducer';
import { SamplesMainAction } from './state/samples.actions';
import { LogoutUserMSA } from '../user/state/user.actions';
import { SendSamplesAction } from './send-samples/state/send-samples.actions';
import { ValidateSamplesAction } from './validate-samples/validate-samples.actions';
import { ValidateSamplesEffects } from './validate-samples/validate-samples.effects';
import { SendSamplesState, sendSamplesLastSentFilesReducer } from './send-samples/state/send-samples.reducer';
import { SendSamplesEffects } from './send-samples/send-samples.effects';

type SamplesState = SamplesMainState & SendSamplesState;
type SamplesReducerAction =
    SamplesMainAction
    | SendSamplesAction
    | ValidateSamplesAction
    | LogoutUserMSA;

export const samplesReducerMap: ActionReducerMap<SamplesState, SamplesReducerAction> = {
    mainData: samplesMainReducer,
    lastSentFiles: sendSamplesLastSentFilesReducer
};
export const samplesEffects = [
    SamplesMainEffects, SendSamplesEffects, ValidateSamplesEffects
];
