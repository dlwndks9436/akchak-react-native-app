import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Paragraph,
  Portal,
  TextInput,
} from 'react-native-paper';
import {RootStackUploadScreenProps} from '../types';
import RNFS from 'react-native-fs';
import axios, {AxiosError} from 'axios';
import {useAppSelector} from '../redux/hooks';
import {checkUserId, selectAccessToken} from '../features/user/userSlice';
import Api from '../libs/api';

export default function UploadPracticeScreen({
  navigation,
  route,
}: RootStackUploadScreenProps) {
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [thumbnailUploaded, setThumbnailUploaded] = useState<boolean>();
  const [videoUploaded, setVideoUploaded] = useState<boolean>();
  // const [uploadId, setUploadId] = useState('');

  const accessToken = useAppSelector(selectAccessToken);
  const userId = useAppSelector(checkUserId);

  useEffect(() => {
    if (thumbnailUploaded === false || videoUploaded === false) {
      setLoading(false);
      setThumbnailUploaded(undefined);
      setVideoUploaded(undefined);
    }
  }, [thumbnailUploaded, videoUploaded]);

  const savePracticeLog = useCallback(async () => {
    await Api.post(
      '/practicelog',
      {
        memo,
        goalId: route.params.goal.id,
        time: route.params.practiceTime,
        videoFileNameExt: route.params.video.fileNameWithExt,
        videoFileName: route.params.video.fileName,
        videoPlaybackTime: route.params.video.duration,
        videoFileSize: route.params.video.fileSize,
      },
      {
        headers: {Authorization: 'Bearer ' + accessToken},
      },
    )
      .then(res => {
        console.log('create practice result: ', res);
        navigation.popToTop();
      })
      .catch((err: AxiosError) => {
        setErrorText('문제가 발생했습니다. 다시 시도해주세요');
        setVisible(true);
        console.log('error response: ', err.response?.data);
      });
  }, [route, navigation, accessToken, memo]);

  useEffect(() => {
    if (thumbnailUploaded && videoUploaded) {
      savePracticeLog();
    }
  }, [thumbnailUploaded, videoUploaded, savePracticeLog]);

  const hideDialog = () => {
    setVisible(false);
  };

  const upload = async () => {
    console.log(route.params);
    setVisible(false);
    setLoading(true);
    try {
      const video = route.params.video;

      const presignedUrls = await axios.get(
        'https://o2dmtsh3e1.execute-api.ap-northeast-2.amazonaws.com/default/akchak-presigned-urls',
        {
          params: {userId: userId, fileName: video.fileName},
        },
      );

      const videoFiles = [
        {
          name: video.fileName,
          filename: video.fileNameWithExt,
          filepath: video.path.slice(7),
          filetype: 'video/mp4',
        },
      ];

      RNFS.uploadFiles({
        toUrl: presignedUrls.data.videoUploadURL,
        files: videoFiles,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
        binaryStreamOnly: true,
      })
        .promise.then(response => {
          if (response.statusCode == 200) {
            console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
            setVideoUploaded(true);
          } else {
            console.log('SERVER ERROR');
            setVideoUploaded(false);
          }
        })
        .catch(err => {
          if (err.description === 'cancelled') {
            // cancelled by user
          }
          setVideoUploaded(false);
          console.log(err);
        });

      const thumbnailFilename = route.params.thumbnailPath.split('/').pop()!;
      const thumbnailName = thumbnailFilename?.split('.')[0];
      const thumbnailFiles = [
        {
          name: thumbnailName,
          filename: thumbnailFilename,
          filepath: route.params.thumbnailPath.slice(7),
          filetype: 'image/jpeg',
        },
      ];

      RNFS.uploadFiles({
        toUrl: presignedUrls.data.thumbnailUploadURL,
        files: thumbnailFiles,
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
        binaryStreamOnly: true,
      })
        .promise.then(response => {
          if (response.statusCode == 200) {
            console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
            setThumbnailUploaded(true);
          } else {
            console.log('SERVER ERROR');
            setThumbnailUploaded(false);
          }
        })
        .catch(err => {
          if (err.description === 'cancelled') {
            // cancelled by user
          }
          setThumbnailUploaded(false);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph style={{fontSize: 20}}>{errorText}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
            <Modal
              visible={loading}
              contentContainerStyle={styles.modalContainerStyle}>
              <ActivityIndicator animating={true} size="large" />
            </Modal>
          </Portal>
          <TextInput
            mode="outlined"
            label="메모 (*선택)"
            value={memo}
            numberOfLines={20}
            multiline={true}
            onChangeText={text => setMemo(text)}
            style={styles.textInput}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={upload}
            contentStyle={styles.buttonContent}>
            업로드
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Dimensions.get('window').height / 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: Dimensions.get('window').width / 1.3,
    marginBottom: 30,
  },
  button: {
    marginHorizontal: 20,
  },
  modalContainerStyle: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: Dimensions.get('window').width / 1.3,
    height: 60,
  },
});
