import { StyleSheet, Text, View } from 'react-native';
import React,{useEffect,useState} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'John Doe',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = messageArray => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messageArray),
    );
  };

  return (
    <View style={{flex:1}}>
      <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
