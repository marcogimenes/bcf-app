import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { BoxMessage, CameraStyled, TextMessage, DebugView } from './styles';
import { Colors } from '../../styles/theme/colors';

function Camera({ onBarcodeReadCallBack, headerMessage, type, debugCamera = false }) {
  const camera = useRef(null);
  const CAM_VIEW_HEIGHT = Dimensions.get('screen').width * 1.5;
  const CAM_VIEW_WIDTH = Dimensions.get('screen').width;

  const widthMask = CAM_VIEW_WIDTH * type.height;
  const heightMask = CAM_VIEW_HEIGHT * type.width;
  return (
    <>
      <BoxMessage>
        <TextMessage>{headerMessage}</TextMessage>
      </BoxMessage>
      <View>
        <CameraStyled
          ref={camera}
          type={RNCamera.Constants.Type.back}
          cameraViewDimensions={{ width: CAM_VIEW_WIDTH, height: CAM_VIEW_HEIGHT }}
          rectOfInterest={type}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          onGoogleVisionBarcodesDetected={onBarcodeReadCallBack}
        />
        <BarcodeMask
          edgeColor={Colors.primary}
          width={widthMask}
          height={heightMask}
          showAnimatedLine={false}
        />
        {debugCamera && <DebugView />}
      </View>
    </>
  );
}

export default Camera;
