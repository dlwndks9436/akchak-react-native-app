import {
  Text,
  ListRenderItem,
  StyleSheet,
  View,
  SafeAreaView,
  // StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PracticeLogsType, PracticeLogType} from '../types/type';
import RNFS from 'react-native-fs';
import {useSelector, useDispatch} from 'react-redux';
import {ApplicationState, setPracticeLogs} from '../redux';

const PracticeLog: React.FC<PracticeLogType> = ({
  duration,
  fileName,
  filePath,
  id,
}) => {
  duration = parseInt(duration!.toString(), 10);
  const hours = Math.floor(duration! / 60 / 60);
  const minutes = Math.floor(duration! / 60) - hours * 60;
  const seconds = duration! % 60;

  const formatted =
    hours === 0
      ? minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0')
      : hours +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');

  const dispatch = useDispatch();

  const deleteLog = () => {
    Alert.alert('Would you delete ' + fileName, undefined, [
      {
        text: 'OK',
        onPress: async () => {
          RNFS.unlink(filePath)
            .then(async () => {
              console.log('file deleted');
              const previousLogStr: string = (await AsyncStorage.getItem(
                'practice_logs',
              )) as string;
              const previousLogs: PracticeLogsType = JSON.parse(previousLogStr);
              const newLogDatas: PracticeLogType[] = previousLogs.datas.filter(
                value => value.id !== id,
              );
              const newLogs: PracticeLogsType = {
                datas: newLogDatas,
                nextID: previousLogs.nextID,
              };
              await AsyncStorage.setItem(
                'practice_logs',
                JSON.stringify(newLogs),
              );
              dispatch(setPracticeLogs(newLogDatas));
            })
            .catch(err => console.log(err));
        },
      },
      {
        text: 'Cancel',
        onPress: async () => {},
        style: 'cancel',
      },
    ]);
  };
  return (
    <TouchableOpacity
      style={styles.practice_log}
      onLongPress={() => deleteLog()}>
      <View style={styles.content}>
        <Text style={styles.title}>{fileName}</Text>
        <Text style={styles.time_text}>{formatted}</Text>
      </View>
      <TouchableOpacity style={styles.upload_button}>
        <Text style={styles.upload_text}>Upload</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function PracticeLogListScreen() {
  const [logDatas, setlogDatas] = useState<PracticeLogType[] | null>(null);

  const {globalPracticeLogs} = useSelector(
    (state: ApplicationState) => state.practiceLogReducer,
  );

  useEffect(() => {
    const fetchLogDatas = async () => {
      const savedLogs: string | null = await AsyncStorage.getItem(
        'practice_logs',
      );
      console.log(savedLogs);

      if (savedLogs !== null) {
        const practiceLogs: PracticeLogsType = JSON.parse(savedLogs);
        setlogDatas(practiceLogs.datas);
      }
    };
    fetchLogDatas();
  }, []);

  useEffect(() => {
    setlogDatas(globalPracticeLogs);
  }, [globalPracticeLogs]);

  const renderItem: ListRenderItem<PracticeLogType> = ({item}) => (
    <PracticeLog
      duration={item.duration}
      fileName={item.fileName}
      filePath={item.filePath}
      date={item.date}
      id={item.id}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {logDatas ? (
        <FlatList
          data={logDatas}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.empty_container}>
          <Text style={styles.title}>Practice logs not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  empty_container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  practice_log: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  content: {
    flex: 10,
  },
  title: {
    fontSize: 20,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  time_text: {
    fontSize: 20,
    marginVertical: 5,
  },
  upload_button: {
    justifyContent: 'center',
    flex: 2,
    alignItems: 'center',
  },
  upload_text: {
    fontWeight: 'bold',
  },
});
