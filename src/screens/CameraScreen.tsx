import * as React from 'react';
import {useRef, useState, useMemo, useCallback} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraDeviceFormat,
  CameraRuntimeError,
  sortFormats,
  useCameraDevices,
  VideoFile,
} from 'react-native-vision-camera';
import {Camera, frameRateIncluded} from 'react-native-vision-camera';
import {
  CONTENT_SPACING,
  MAX_ZOOM_FACTOR,
  SAFE_AREA_PADDING,
} from '../utils/constants';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import {useIsForeground} from '../hooks/useIsForeground';
import {StatusBarBlurBackground} from '../components/StatusBarBlurBackground';
import {CaptureButton} from '../components/CaptureButton';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {RootStackCameraScreenProps} from '../types';
import {useIsFocused} from '@react-navigation/core';
import {formatDuration} from '../utils';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import Orientation from 'react-native-orientation-locker';
import {Button, Dialog, Paragraph, Portal, Text} from 'react-native-paper';
import {FFprobeKit} from 'ffmpeg-kit-react-native';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

export default function CameraScreen({
  navigation,
  route,
}: RootStackCameraScreenProps): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);
  const creationTime = useRef<Date>();
  const intervalId = useRef<NodeJS.Timer>();

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'front',
  );
  // const [enableHdr, setEnableHdr] = useState(false);
  // const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [timeRecording, setTimeRecording] = useState<number>(0);

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  useAndroidBackHandler(() => {
    if (isRecording) {
      showDialog();
    } else {
      navigation.reset({index: 0, routes: [{name: 'Tab'}]});
    }
    return true;
  });

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  //#region Memos
  const [is60Fps] = useState(true);
  const fps = useMemo(() => {
    if (!is60Fps) return 30;

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30;
    }

    // const supportsHdrAt60Fps = formats.some(
    //   f =>
    //     f.supportsVideoHDR &&
    //     f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    // );
    // if (enableHdr && !supportsHdrAt60Fps) {
    //   // User has enabled HDR, but HDR is not supported at 60 FPS.
    //   return 30;
    // }

    const supports60Fps = formats.some(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, 60)),
    );
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [device?.supportsLowLightBoost, enableNightMode, formats, is60Fps]);

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  // const supportsFlash = device?.hasFlash ?? false;
  // const supportsHdr = useMemo(
  //   () => formats.some(f => f.supportsVideoHDR || f.supportsPhotoHDR),
  //   [formats],
  // );
  // const supports60Fps = useMemo(
  //   () =>
  //     formats.some(f =>
  //       f.frameRateRanges.some(rate => frameRateIncluded(rate, 60)),
  //     ),
  //   [formats],
  // );
  // const canToggleNightMode = enableNightMode
  //   ? true // it's enabled so you have to be able to turn it off again
  //   : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  //#endregion

  const format = useMemo(() => {
    let result = formats;
    // if (enableHdr) {
    //   // We only filter by HDR capable formats if HDR is set to true.
    //   // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
    //   result = result.filter(f => f.supportsVideoHDR);
    // }

    // find the first format that includes the given FPS
    return result.find(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, fps)),
    );
  }, [formats, fps]);

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
      setIsRecording(_isPressingButton);
    },
    [isPressingButton],
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback(
    async (media: VideoFile) => {
      console.log(`Media captured! ${JSON.stringify(media)}`);
      setTimeRecording(0);
      const fileData = await FFprobeKit.execute(
        `-v quiet -print_format json -show_format -show_streams ${media.path}`,
      );
      const dataStr = await fileData.getOutput();
      console.log('video metadata: ', dataStr);
      const data = JSON.parse(dataStr);
      console.log('duration: ', data.format.duration);

      navigation.navigate('영상 자르기', {
        goal: route.params.goal,
        media,
        creationTime: creationTime.current!.toUTCString(),
        practiceTime: parseInt(data.format.duration, 10),
      });
    },
    [navigation, route],
  );
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);
  // const onFlashPressed = useCallback(() => {
  //   setFlash(f => (f === 'off' ? 'on' : 'off'));
  // }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then(status =>
      setHasMicrophonePermission(status === 'authorized'),
    );
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => Orientation.unlockAllOrientations();
  }, []);

  useEffect(() => {
    if (isRecording) {
      creationTime.current = new Date();
      intervalId.current = setInterval(() => {
        setTimeRecording(seconds => seconds + 1);
      }, 1000);
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isRecording]);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });
  //#endregion

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? 'active' : 'inactive'
      } camera. ` +
        `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>
              연습을 취소하시겠습니까? 취소할 경우 저장되지 않습니다
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog();
                navigation.goBack();
              }}>
              네
            </Button>
            <Button onPress={hideDialog}>아니요</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <StatusBar
        translucent={true}
        backgroundColor={'#00000000'}
        barStyle={'light-content'}
      />
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                // fps={30}
                // hdr={enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                // photo={true}
                video={true}
                audio={hasMicrophonePermission}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={media => {
          onMediaCaptured(media as VideoFile);
        }}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <StatusBarBlurBackground />
      {isRecording && (
        <Text style={styles.timeRecording}>
          {formatDuration(timeRecording)}
        </Text>
      )}

      <View style={styles.rightButtonRow}>
        {supportsCameraFlipping && !isRecording && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlipCameraPressed}
            disabledOpacity={0.4}>
            <IonIcon name="camera-reverse" color="white" size={24} />
          </PressableOpacity>
        )}
        {/* {supportsFlash && !isRecording && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlashPressed}
            disabledOpacity={0.4}>
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )} */}
        {/* {supports60Fps && !isRecording && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setIs60Fps(!is60Fps)}>
            <Text style={styles.text}>
              {is60Fps ? '60' : '30'}
              {'\n'}FPS
            </Text>
          </PressableOpacity>
        )} */}
        {/* {supportsHdr && !isRecording && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setEnableHdr(h => !h)}>
            <MaterialIcon
              name={enableHdr ? 'hdr' : 'hdr-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )} */}
        {/* {canToggleNightMode && !isRecording && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setEnableNightMode(!enableNightMode)}
            disabledOpacity={0.4}>
            <IonIcon
              name={enableNightMode ? 'moon' : 'moon-outline'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    right: SAFE_AREA_PADDING.paddingRight,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeRecording: {
    fontSize: 30,
    color: 'white',
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom + 20,
    left: SAFE_AREA_PADDING.paddingLeft + 20,
  },
});
