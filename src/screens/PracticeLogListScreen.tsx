import {
  ListRenderItem,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PracticeLogType,
  PracticeLogItemType,
  RootStackTabScreenProps,
} from '../types';
import RNFS from 'react-native-fs';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  practiceLogDeleted,
  selectAllPracticeLogs,
} from '../features/practiceLogs/practiceLogsSlice';
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  Text,
  Title,
} from 'react-native-paper';

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

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const dispatch = useAppDispatch();

  const deleteLog = async () => {
    hideDialog();
    await RNFS.unlink(directory)
      .then(async () => {
        console.log('file deleted');
      })
      .catch(err => console.log(err));

    const previousLogStr = await AsyncStorage.getItem('practice_logs');
    if (previousLogStr) {
      const previousLogs: PracticeLogType[] = JSON.parse(previousLogStr);
      const newLogs: PracticeLogType[] = previousLogs.filter(
        value => value.id !== id,
      );
      await AsyncStorage.setItem('practice_logs', JSON.stringify(newLogs));
    }
    dispatch(practiceLogDeleted(id));
  };

  return (
    <TouchableOpacity
      style={styles.practice_log}
      onLongPress={() => showDialog()}
      onPress={() => navigation.navigate('VideoPlay', {videoUri: filePath})}>
      <View style={styles.content}>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Paragraph>{'Would you delete ' + fileName + '?'}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={deleteLog}>OK</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Title style={styles.titleText}>{fileName}</Title>
        <Text>{formattedDurationWithoutMillisecond}</Text>
      </View>
      <TouchableOpacity
        style={styles.upload_button}
        onPress={() =>
          navigation.navigate('VideoTrim', {
            videoUri: filePath,
            duration: duration as number,
            directory: directory,
            fileName,
            id,
          })
        }>
        <Text>Upload</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function PracticeLogListScreen({
  navigation,
}: RootStackTabScreenProps) {
  const practiceLogs = useAppSelector(selectAllPracticeLogs);

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
      {practiceLogs.length > 0 ? (
        <FlatList
          data={practiceLogs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.empty_container}>
          <Text>Practice logs not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
  upload_button: {
    justifyContent: 'center',
    flex: 2,
    alignItems: 'center',
  },
  titleText: {
    marginBottom: 10,
  },
});
