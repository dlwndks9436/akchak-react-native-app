import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Dialog, Paragraph, Portal, TextInput} from 'react-native-paper';
import {RootStackUploadScreenProps} from '../types';
import RNFS from 'react-native-fs';
import {API_ENDPOINT} from 'react-native-dotenv';
import axios, {AxiosError} from 'axios';
import {decode} from 'base64-arraybuffer';
// import {S3Client} from '@aws-sdk/client-s3';
// import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {checkUserId, selectAccessToken} from '../features/user/userSlice';
import Api from '../libs/api';

export default function UploadPracticeScreen({
  navigation,
  route,
}: RootStackUploadScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [mode, setMode] = useState<'upload' | 'edit'>();

  const accessToken = useAppSelector(selectAccessToken);
  const userId = useAppSelector(checkUserId);

  const hideDialog = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (route.params.title && route.params.description) {
      setMode('edit');
      setTitle(route.params.title);
      setDescription(route.params.description);
    } else {
      setMode('upload');
    }
  }, [route.params.title, route.params.description]);

  // const [uploadProgress, setUploadProgress] = useState(0);

  // const upload = async () => {
  //   const formData = new FormData();
  //   console.log(route.params.thumbnailName);
  //   formData.append('video', {
  //     uri: route.params.trimmedVideoUri,
  //     type: 'video/mp4',
  //     name: route.params.fileName,
  //   });
  //   formData.append('thumbnail', {
  //     uri: route.params.thumbnailUri,
  //     type: 'image/jpeg',
  //     name: route.params.thumbnailName,
  //   });
  //   formData.append('id', route.params.id);
  //   formData.append('duration', route.params.duration);
  //   formData.append('practiceTime', route.params.practiceTime);
  //   const res = await Api.post('practice/upload', formData, {
  //     headers: {
  //       Authorization: 'Bearer ' + accessToken,
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     transformRequest: data => {
  //       return data;
  //     },
  // onUploadProgress: p => {
  //   const percentCompleted = Math.round((p.loaded * 100) / p.total);
  //   setUploadProgress(percentCompleted);
  //   console.log('progress: ', uploadProgress);
  // },
  //   }).catch(err => console.log(err));
  //   console.log('res: ', res);
  // };

  const upload = async () => {
    setVisible(false);
    setLoading(true);
    try {
      const presignedUrls = await axios.get(API_ENDPOINT, {
        params: {userId: userId, directory: route.params.directory},
      });
      console.log('presignedUrl response: ', presignedUrls);

      const videoBase64 = await RNFS.readFile(
        route.params.trimmedVideoUri!,
        'base64',
      );

      const video = decode(videoBase64);

      await axios
        .put(presignedUrls.data.videoUploadURL, video, {
          headers: {
            'Content-Type': 'video/mp4',
          },
        })
        .then(res => {
          console.log('upload video result: ', res);
        });

      const thumbnailBase64 = await RNFS.readFile(
        route.params.thumbnailUri!,
        'base64',
      );
      const thumbnail = decode(thumbnailBase64);

      await axios
        .put(presignedUrls.data.thumbnailUploadURL, thumbnail, {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        })
        .then(res => {
          console.log('upload thumbnail result: ', res);
        });

      await Api.post(
        '/practice',
        {
          title,
          description,
          from: route.params.directory,
          duration: route.params.duration,
          practiceTime: route.params.practiceTime,
          s3Key: presignedUrls.data.videoKey,
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
          if (err.response?.status === 400 && err.response?.data?.param) {
            if (err.response.data.param === 'title') {
              setVisible(true);
              setErrorText('title is must be longer than 5 characters');
            } else if (err.response.data.param === 'duration') {
              setVisible(true);
              setErrorText('duration is not a number');
            } else if (err.response.data.param === 'from') {
              setVisible(true);
              setErrorText('the video file is not valid');
            } else if (err.response.data.param === 'practiceTime') {
              setVisible(true);
              setErrorText('practice time is not valid');
            } else if (err.response.data.param === 's3Key') {
              setVisible(true);
              setErrorText('uploaded video is not valid');
            }
            console.log(err.response.status);
          } else {
            setVisible(true);
            setErrorText('Unexpected error occured');
            console.log('error response: ', err.response?.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const edit = async () => {
    setVisible(false);
    setLoading(true);
    await Api.patch(
      'practice/' + route.params.id,
      {title, description},
      {headers: {Authorization: 'Bearer ' + accessToken}},
    )
      .then(() => {
        navigation.goBack();
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400 && err.response?.data?.param) {
          if (err.response.data.param === 'title') {
            setVisible(true);
            setErrorText('title is must be longer than 5 characters');
          }
        }
      });
    setLoading(false);
  };

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
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
          </Portal>
          <TextInput
            mode="outlined"
            label="title"
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.textInput}
          />
          <TextInput
            mode="outlined"
            label="description"
            value={description}
            onChangeText={text => setDescription(text)}
            multiline={true}
            numberOfLines={15}
            style={styles.textInput}
          />
          <View style={styles.buttonContainer}>
            <Button style={styles.button} mode="contained" onPress={goBack}>
              Back
            </Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={mode === 'upload' ? upload : edit}
              loading={loading}>
              {mode === 'upload' ? 'Upload' : 'Edit'}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Dimensions.get('window').height / 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    width: Dimensions.get('window').width / 1.3,
    marginBottom: 30,
  },
  button: {
    marginHorizontal: 20,
    width: Dimensions.get('window').width / 3,
  },
});
