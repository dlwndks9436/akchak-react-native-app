import {PracticeLogType} from '../../types/type';
import {Dispatch} from 'react';

export interface SetPracticeLogAction {
  readonly type: 'SET_PRACTICE_LOG_DATAS';
  payload: PracticeLogType[];
}

// export interface IncrementPracticeIDAction {
//   readonly type: 'INCREMENT_PRACTICE_LOG_NEXT_ID';
//   payload: number;
// }

export type PracticeLogAction = SetPracticeLogAction;

export const setPracticeLogs = (practiceLogDatas: PracticeLogType[]) => {
  return (dispatch: Dispatch<PracticeLogAction>) => {
    dispatch({type: 'SET_PRACTICE_LOG_DATAS', payload: practiceLogDatas});
  };
};

// export const incrementPractice = (practiceLogsNextID: number) => {
//   return (dispatch: Dispatch<PracticeLogAction>) => {
//     dispatch({
//       type: INCREMENT_PRACTICE_LOG_NEXT_ID,
//       payload: practiceLogsNextID,
//     });
//   };
// };
