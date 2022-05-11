import {Dimensions, StyleSheet, View} from 'react-native';
import {Avatar, IconButton, Menu, Text, Title} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  checkEmail,
  checkUsername,
  logout,
  selectAccessToken,
} from '../features/user/userSlice';
import * as RNLocalize from 'react-native-localize';
import Api from '../libs/api';
import {BarChart} from 'react-native-chart-kit';
import {theme} from '../styles/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackTabScreenProps} from '../types';

export default function ProfileScreen({navigation}: RootStackTabScreenProps) {
  const username = useAppSelector(checkUsername);
  const email = useAppSelector(checkEmail);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const [chartData, setChartData] = useState<any>([]);
  const [averageTime, setAverageTime] = useState<number>();
  const [showMenu, setShowMenu] = useState(false);

  const getPracticeTime = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    console.log('get practice time');

    const result: number[] = await Api.get('/practicelog/time', {
      params: {timezone: RNLocalize.getTimeZone()},
      headers: {Authorization: 'Bearer ' + accessToken},
    }).then(val => val.data);
    const data = result.map(val => Math.ceil(val / 60));
    let time = 0;
    data.forEach(val => {
      time += val;
    });
    console.log(data);
    setChartData(data);
    setAverageTime(Math.ceil(time / 7));
  }, [accessToken]);

  useEffect(() => {
    getPracticeTime();
  }, [getPracticeTime]);

  const logoutUser = () => {
    console.log('logout');
    dispatch(logout());
  };

  const openMenu = () => setShowMenu(true);

  const closeMenu = () => setShowMenu(false);

  const navigateToPersonalDataScreen = () => {
    closeMenu();
    navigation.navigate('개인 정보');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.anchor}>
        <Menu
          visible={showMenu}
          onDismiss={closeMenu}
          anchor={<IconButton icon="cog" onPress={openMenu} />}>
          <Menu.Item title="개인 정보" onPress={navigateToPersonalDataScreen} />
          <Menu.Item title="로그아웃" onPress={logoutUser} />
        </Menu>
      </View>
      <BarChart
        data={{
          labels: ['6일전', '5일전', '4일전', '3일전', '2일전', '어제', '오늘'],
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={Dimensions.get('window').width / 1.2}
        height={Dimensions.get('window').height / 3}
        yAxisLabel=""
        yAxisSuffix="분"
        showValuesOnTopOfBars={true}
        withInnerLines={false}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
          barPercentage: 0.5,
          fillShadowGradient: theme.colors.primary,
          fillShadowGradientTo: '#1E2923',
        }}
      />
      <View style={styles.rowContainer}>
        <Title>주간 평균 연습 시간 : {averageTime} 분</Title>
        <IconButton icon="refresh" onPress={getPracticeTime} />
      </View>
      <View style={styles.myInfoContainer}>
        <Avatar.Image
          size={50}
          source={require('../assets/images/profile-icon.jpg')}
          style={styles.profileIcon}
        />
        <View>
          <Text>Username : {username}</Text>
          <Text>E-mail : {email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center'},
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  logoutButtonContent: {
    height: 60,
  },
  anchor: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: Dimensions.get('window').height / 10,
  },
  myInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileIcon: {
    marginRight: 5,
  },
});
