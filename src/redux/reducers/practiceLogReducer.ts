import {PracticeLogType} from '../../types/type';
import {PracticeLogAction} from '../actions/practiceLogActions';

type PracticeLogState = {
  globalPracticeLogs: PracticeLogType[];
};

const initialState = {
  globalPracticeLogs: [] as PracticeLogType[],
};

export function practiceLogReducer(
  state: PracticeLogState = initialState,
  action: PracticeLogAction,
) {
  switch (action.type) {
    case 'SET_PRACTICE_LOG_DATAS':
      return {...state, globalPracticeLogs: action.payload};
    default:
      return state;
  }
}
