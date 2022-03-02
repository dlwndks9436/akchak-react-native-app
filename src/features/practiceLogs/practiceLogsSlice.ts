import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../redux/store';
import {PracticeLogType} from '../../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PracticeLogState {
  datas: PracticeLogType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PracticeLogState = {
  datas: [],
  status: 'idle',
  error: null,
};

export const initializePracticeLogs = createAsyncThunk(
  'practiceLogs/initializePracticeLogs',
  async () => {
    const datas = await AsyncStorage.getItem('practice_logs');
    return datas ? JSON.parse(datas) : [];
  },
);

const practiceLogsSlice = createSlice({
  name: 'practiceLogs',
  initialState,
  reducers: {
    practiceLogAdded: (state, action: PayloadAction<PracticeLogType>) => {
      state.datas.push(action.payload);
    },
    practiceLogDeleted: (state, action: PayloadAction<string>) => {
      const ids = state.datas.map(practicelog => practicelog.id);
      const index = ids.indexOf(action.payload);
      if (index !== -1) {
        state.datas.splice(index, 1);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initializePracticeLogs.pending, state => {
        state.status = 'loading';
      })
      .addCase(initializePracticeLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.datas = state.datas.concat(action.payload);
        }
      })
      .addCase(initializePracticeLogs.rejected, (state, action) => {
        state.status = 'failed';
        if (action.error.message !== undefined) {
          state.error = action.error.message;
        }
      });
  },
});

export const {practiceLogAdded, practiceLogDeleted} = practiceLogsSlice.actions;

export default practiceLogsSlice.reducer;

export const selectAllPracticeLogs = (state: RootState) =>
  state.practiceLogs.datas;

export const selectPracticeLogById = (
  state: RootState,
  practiceLogId: string,
) =>
  state.practiceLogs.datas.find(
    practiceLog => practiceLog.id === practiceLogId,
  );

export const selectMostRecentPracticeLog = (state: RootState) =>
  state.practiceLogs.datas[state.practiceLogs.datas.length - 1];

export const checkPracticeLogsStatus = (state: RootState) =>
  state.practiceLogs.status;
