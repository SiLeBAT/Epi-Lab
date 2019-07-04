import { ActionReducerMap } from '@ngrx/store';
import { ContentMainStates, contentMasterDataReducer } from './state/content.state';
import { ContentMainAction } from './state/content.actions';

type ContentStates = ContentMainStates;
type ContentReducerAction = ContentMainAction;

export const contentReducerMap: ActionReducerMap<ContentStates, ContentReducerAction> = {
    masterData: contentMasterDataReducer
};
