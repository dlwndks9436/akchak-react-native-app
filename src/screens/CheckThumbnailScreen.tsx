import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {RootStackCheckThumbnailScreenProps} from '../types';
import {Button} from 'react-native-paper';

export default function CheckThumbnailScreen({
  navigation,
  route,
}: RootStackCheckThumbnailScreenProps) {
  const thumbnailUri = route.params.thumbnailPath;
  const navigateToNextScreen = () => {
    navigation.navigate('업로드', {
      goal: route.params.goal,
      video: route.params.video,
      creationTime: route.params.creationTime,
      practiceTime: route.params.practiceTime,
      thumbnailPath: route.params.thumbnailPath,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: thumbnailUri}} style={styles.thumbnail} />
      <Button
        icon="chevron-right"
        style={styles.nextButton}
        onPress={navigateToNextScreen}
        contentStyle={{flexDirection: 'row-reverse'}}>
        다음
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  thumbnail: {
    height: Dimensions.get('window').height / 1.3,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  nextButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
});
