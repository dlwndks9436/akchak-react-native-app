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
import {
  PracticeLogsType,
  PracticeLogType,
  PracticeLogItemType,
  RootStackTabScreenProps,
} from '../types/type';
import RNFS from 'react-native-fs';
import {useSelector, useDispatch} from 'react-redux';
import {ApplicationState, setPracticeLogs} from '../redux';
import Orientation from 'react-native-orientation-locker';

const PracticeLog: React.FC<PracticeLogItemType> = ({
  duration,
  formattedDurationWithoutMillisecond,
  fileName,
  filePath,
  id,
  navigation,
  directory,
}) => {
  duration = parseInt(duration!.toString(), 10);

  const dispatch = useDispatch();

  const deleteLog = () => {
    Alert.alert('Would you delete ' + fileName, undefined, [
      {
        text: 'OK',
        onPress: async () => {
          RNFS.unlink(directory)
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
      onLongPress={() => deleteLog()}
      onPress={() => navigation.navigate('VideoPlay', {videoUri: filePath})}>
      <View style={styles.content}>
        <Text style={styles.title}>{fileName}</Text>
        <Text style={styles.time_text}>
          {formattedDurationWithoutMillisecond}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.upload_button}
        onPress={() =>
          navigation.navigate('VideoTrim', {
            videoUri: filePath,
            duration: duration as number,
            directory: directory,
          })
        }>
        <Text style={styles.upload_text}>Upload</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function PracticeLogListScreen({
  navigation,
}: RootStackTabScreenProps) {
  const [logDatas, setlogDatas] = useState<PracticeLogType[] | null>(null);

  const {globalPracticeLogs} = useSelector(
    (state: ApplicationState) => state.practiceLogReducer,
  );

  useEffect(() => {
    Orientation.unlockAllOrientations();
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
      directory={item.directory}
      formattedDuration={item.formattedDuration}
      formattedDurationWithoutMillisecond={
        item.formattedDurationWithoutMillisecond
      }
      fileName={item.fileName}
      filePath={item.filePath}
      date={item.date}
      id={item.id}
      navigation={navigation}
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
    color: 'gray',
  },
  time_text: {
    fontSize: 20,
    marginVertical: 5,
    color: 'gray',
  },
  upload_button: {
    justifyContent: 'center',
    flex: 2,
    alignItems: 'center',
  },
  upload_text: {
    fontWeight: 'bold',
    color: 'gray',
  },
});
