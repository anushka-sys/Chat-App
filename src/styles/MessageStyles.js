// MessageStyles.js

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-horizontal: 20px;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const UserImgWrapper = styled.View`
  padding-vertical: 15px;
`;

export const UserImg = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

export const TextSection = styled.View`
  flex: 1;
  margin-left: 12px;
  padding-vertical: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6e6;
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const UserName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #666666;
`;

export const MessageText = styled.Text`
  font-size: 14px;
  color: #555555;
`;
