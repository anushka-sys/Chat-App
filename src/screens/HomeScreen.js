import React from 'react';
import { FlatList } from 'react-native';

import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';

const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/user-1.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/user-2.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/user-4.jpg'),
    messageTime: '1 hour ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/user-3.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <Card
      onPress={() =>
        navigation.navigate('Chat', {
          userName: item.userName,
        })
      }
    >
      <UserInfo>
        <UserImgWrapper>
          <UserImg source={item.userImg} />
        </UserImgWrapper>

        <TextSection>
          <UserInfoText>
            <UserName>{item.userName}</UserName>
            <PostTime>{item.messageTime}</PostTime>
          </UserInfoText>

          <MessageText numberOfLines={1}>{item.messageText}</MessageText>
        </TextSection>
      </UserInfo>
    </Card>
  );

  return (
    <Container>
      <FlatList
        data={Messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default HomeScreen;
