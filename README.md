# akchak-react-native-app

![악착 feature](https://user-images.githubusercontent.com/84265308/169192389-8717f0af-55e7-4749-ac49-584024628466.png)

# akchak

## 어플 체험해보기

https://play.google.com/store/apps/details?id=com.juann.akchak

---------------------------------------------------------
### 프로젝트 소개
많은 사람들이 악기 연습을 할 때 여러 가지 이유로 어려움을 겪습니다.
악기를 연습해도 실력이 빠르게 늘지 않거나, 혼자 연습하느라 지루하고 동기부여가 될만한 자극이 부족할 때도 있습니다.
이런 문제들을 해소하기 위해 제작한 앱이 '악착'입니다.

'악착'은 시작할 때 목표를 정하도록 합니다.
정할 수 있는 목표의 종류는 음악과 교본이 있습니다.
연습할 목표를 정하고나면 본격적으로 연습을 시작할 수 있습니다.

연습을 시작하면 '악착'이 카메라를 통해서 사용자의 모습을 녹화하게 됩니다.
악기를 연습할 때 자기의 연주를 녹화해서 모니터링하는 것은 정말 중요합니다.
카메라로 녹화된 영상에서는 자신의 연주 자세나 박자나 소리에 어떤 문제가 있는지 알 수 있게 됩니다.
하지만 많은 사람들이 귀찮다는 이유로 하지 않고 있습니다.
'악착'을 통해서 자신의 연주를 녹화해서 내 실력을 점검할 수 있습니다.

연습을 끝내면 '악착'에서는 다른 사용자들과 자신의 연주 영상을 공유할 수 있도록 영상 자르기 기능을 제공합니다.
별도의 툴 없이 영상에서 잘 연주했다고 생각한 부분만 잘라서 영상을 업로드할 수 있습니다.
손쉽게 섬네일 제작할 수 있는 기능도 제공합니다.

영상 업로드를 완료하면 자신의 연습 시간이 업데이트 되며, 프로필 화면에서 주간 평균 연습 시간과 함께 연습 시간을 차트로 확인할 수 있습니다.
다른 사람들의 연주영상을 홈화면에서 조회할 수 있습니다.
다른 사람들의 연습하는 모습을 보면서 자극을 받을 수 있습니다.

-----------------------------------------------------------

#### 기술스택
* typescript
* react native

#### CI
* github

#### 주요 패키지
* react-navigation
* reduxjs
* ffmpeg-kit-react-native
* react-native-paper
* react-native-video
* react-native-video-controls
* react-native-vision-camera
* react-redux
* validator

-----------------------------------------------------------

### UI 명세

![akchak 화면 설계서](https://user-images.githubusercontent.com/84265308/169447438-f33128da-6f49-4d5b-bbd1-ba5f2927b541.jpg)
![akchak 화면 설계서 (1)](https://user-images.githubusercontent.com/84265308/169447490-dbd99f9e-25f1-4832-af75-5fdc4bf9a08f.jpg)
![akchak 화면 설계서 (2)](https://user-images.githubusercontent.com/84265308/169447506-017e208d-06ca-4ca9-891f-dc5c5068f2b9.jpg)
![akchak 화면 설계서 (3)](https://user-images.githubusercontent.com/84265308/169447517-084bf044-30cd-4c11-928f-b6f316d079ff.jpg)
![akchak 화면 설계서 (4)](https://user-images.githubusercontent.com/84265308/169447529-e56f20fc-0d16-420a-8a78-5de2dcd37975.jpg)
![akchak 화면 설계서 (5)](https://user-images.githubusercontent.com/84265308/169447550-3262a9ce-6dce-41ed-8fc6-37808125cbbf.jpg)
![akchak 화면 설계서 (6)](https://user-images.githubusercontent.com/84265308/169447577-be3666cb-9e06-474d-933a-07f62616b4ff.jpg)
![akchak 화면 설계서 (7)](https://user-images.githubusercontent.com/84265308/169447594-b23af45f-5068-447c-90a5-267ce1cf4a16.jpg)
![akchak 화면 설계서 (8)](https://user-images.githubusercontent.com/84265308/169447610-69eae9d8-311e-411e-83e5-4e8fa4ee4d66.jpg)
![akchak 화면 설계서 (9)](https://user-images.githubusercontent.com/84265308/169447621-e9fbf09a-c685-4920-942a-d43041e6ae75.jpg)
![akchak 화면 설계서 (10)](https://user-images.githubusercontent.com/84265308/169447630-279d4f0f-d434-4398-bed8-89f989ea892e.jpg)
![akchak 화면 설계서 (11)](https://user-images.githubusercontent.com/84265308/169447635-bf76a9ce-efbb-489a-b9dc-09d3e05b9c4e.jpg)
![akchak 화면 설계서 (12)](https://user-images.githubusercontent.com/84265308/169447654-e6710907-89ea-4776-ae22-03112ffbe5c7.jpg)
![akchak 화면 설계서 (13)](https://user-images.githubusercontent.com/84265308/169447677-d77b24f9-bdb4-48d0-8de7-64ce0f86e089.jpg)
![akchak 화면 설계서 (14)](https://user-images.githubusercontent.com/84265308/169447692-bde2c5a9-e340-4626-a578-72b039f9983c.jpg)
![akchak 화면 설계서 (15)](https://user-images.githubusercontent.com/84265308/169447706-27cd19e0-d8a3-4645-b867-3e7fd0687269.jpg)
![akchak 화면 설계서 (16)](https://user-images.githubusercontent.com/84265308/169447715-0da52304-e245-48bd-a01b-2e3f0827bd90.jpg)
![akchak 화면 설계서 (17)](https://user-images.githubusercontent.com/84265308/169447732-fc1718cd-e410-48ef-9bdb-110c05e4a050.jpg)
![akchak 화면 설계서 (18)](https://user-images.githubusercontent.com/84265308/169447741-cb4c9a46-5746-46c1-b655-2553d508e147.jpg)
![akchak 화면 설계서 (19)](https://user-images.githubusercontent.com/84265308/169447749-9c207bc9-fa61-49c1-824b-96febd3ce997.jpg)
![akchak 화면 설계서 (20)](https://user-images.githubusercontent.com/84265308/169447756-b5d4b317-0fbb-4615-8807-98fab4696bd3.jpg)
![akchak 화면 설계서 (21)](https://user-images.githubusercontent.com/84265308/169447773-e1fa44ee-6862-4020-bf19-6e0c516b8281.jpg)
![akchak 화면 설계서 (22)](https://user-images.githubusercontent.com/84265308/169447792-e34bd032-58f3-4461-8c2f-fd8d9cc3325e.jpg)
![akchak 화면 설계서 (23)](https://user-images.githubusercontent.com/84265308/169447806-f24f247e-6e53-41f6-b67f-9bf8ca5f87a5.jpg)
![akchak 화면 설계서 (24)](https://user-images.githubusercontent.com/84265308/169447823-7997028d-b986-4904-bfc8-9a93560cc8bc.jpg)

--------------------------------------------------

## 구현한 기능

* ffmpegkit 패키지를 이용하여 별도의 인코딩 없이 영상 자르기와 섬네일 추출
* redux 이용해서 현재 user의 접속 정보를 Global 변수로 사용
* axios interceptor를 이용해서 refresh token을 자동으로 재발급 받도록 하기
* react-native-paper의 ui component 사용하여 일관성 있는 theme 유지
* expo-secure-store를 이용하여 jwt token 저장
* react-native-video-controls이 typescript 지원하지 않아서 definition file 만듬
* validator를 이용해서 frontend에서도 예외처리를 하여 서버에 부담을 덜어냄
* localize를 이용해서 현재 사용자의 timezone 얻기
* react-native-chart-kit 이용해서 서버에서 받은 데이터로 차트 생성
* react-native-fs 이용해서 파일을 aws s3에 업로드 및 파일 삭제

## 구현해야하는 기능

* 피드백을 받아보니 목표를 설정할 때 사용하기 어렵다는 후기가 있었다. 연습을 시작할 때 목표를 쉽게 설정할 수 있도록 ui 개선이 필요하다.


## resonar 서버 구경하기

https://github.com/dlwndks9436/akchak-nodejs-server
