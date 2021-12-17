import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';

const FButton = ({ onPress, children, style, buttonStyle, loading, small, tiny, big }: any) => {
  return (
    <Button small={small} tiny={tiny} big={big} style={style}>
      <Clickable onPress={onPress}>
        <Content style={buttonStyle} small={small} tiny={tiny} big={big}>
          {loading ? (<ActivityIndicator size="small" color="white" />) : (<Text style={{ fontSize: tiny || big ? 15 : 14 }}>{children}</Text>)}
        </Content>
      </Clickable>
    </Button>
  );
};

export default FButton;

//@ts-ignore
const Button = styled.View`
  height: ${({ small, tiny }: { small: boolean, tiny: boolean }) => small ? '36px' : (tiny ? '22px' : '40px')};
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

//@ts-ignore
const Content = styled.View`
  width: ${({big} : {big: boolean}) => big ? '160px' : '106px'};
  height: 36px;
  padding-left: ${({ small, tiny, big }: { small: boolean, tiny: boolean, big: boolean }) => small ? '12px' : (tiny || big ? '8px' : '28px')};
  padding-right: ${({ small, tiny, big }: { small: boolean, tiny: boolean, big: boolean }) => small ? '12px' : (tiny || big ? '8px' : '28px')};
  background: #F48E39;
  font-weight: 400;
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
