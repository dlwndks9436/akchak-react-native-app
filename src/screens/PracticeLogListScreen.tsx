import {
  Text,
  ListRenderItem,
  StyleSheet,
  View,
  SafeAreaView,
  // StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PracticeLogsType, PracticeLogType} from '../types/type';

const PracticeLog: React.FC<PracticeLogType> = ({duration, fileName}) => {
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
  return (
    <TouchableOpacity style={styles.practice_log}>
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
      <FlatList
        data={logDatas}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
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
