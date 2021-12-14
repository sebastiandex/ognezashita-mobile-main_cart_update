import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';

const FButton = ({ onPress, children, style, buttonStyle, loading, small, tiny }: any) => {
  return (
    <Button small={small} tiny={tiny} style={style}>
      <Clickable onPress={onPress}>
        <Content style={buttonStyle} small={small} tiny={tiny}>
          {loading ? (<ActivityIndicator size="small" color="white" />) : (<Text style={{ fontSize: tiny ? 15 : 14 }}>{children}</Text>)}
        </Content>
      </Clickable>
    </Button>
  );
};

export default FButton;

//@ts-ignore
const Button = styled.View`
  height: ${({ small, tiny }: { small: boolean, tiny: boolean }) => small ? '28px' : (tiny ? '22px' : '40px')};
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

//@ts-ignore
const Content = styled.View`
  width: 106px;
  height: 36px;
  padding-left: ${({ small, tiny }: { small: boolean, tiny: boolean }) => small ? '12px' : (tiny ? '8px' : '28px')};
  padding-right: ${({ small, tiny }: { small: boolean, tiny: boolean }) => small ? '12px' : (tiny ? '8px' : '28px')};
  background: #F48E39;
  border-radius: 8px;
  font-size: 15px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
`;

//@ts-ignore
const Clickable = styled.TouchableOpacity`
  flex-shrink: 0;
  flex-direction: row;
`;

//@ts-ignore
const Text = styled.Text`
  color: white;
`;
