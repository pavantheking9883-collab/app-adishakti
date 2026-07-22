import React from 'react';
import { View, Image } from 'react-native';

interface LotusLogoProps {
  size?: number;
}

export const LotusLogo: React.FC<LotusLogoProps> = ({ size = 48 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assets/logo_transparent.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
};
