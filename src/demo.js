
// Step 1 — Import required components
// Add these imports:
// JavaScript
import { InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
If vector icons aren’t installed, install them. Without this, your send button will still look amateur.

Step 2 — Custom InputToolbar
Add this function ABOVE return:
JavaScript
const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#fff',
      paddingTop: 6,
      paddingBottom: 6,
      paddingHorizontal: 8,
      borderTopWidth: 0,
      elevation: 10, // android shadow
      shadowColor: '#000', // ios shadow
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    }}
    primaryStyle={{
      alignItems: 'center',
    }}
  />
);
This removes the ugly top border and adds elevation.
Step 3 — Custom Text Input (Composer)
This is the MOST important part visually.
JavaScript
const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      backgroundColor: '#F1F3F6',
      borderRadius: 25,
      paddingHorizontal: 16,
      marginLeft: 8,
      marginRight: 8,
      fontSize: 16,
      lineHeight: 20,
      maxHeight: 120,
      minHeight: 44,
    }}
    placeholderTextColor="#888"
  />
);
Now it becomes pill-shaped like WhatsApp/Telegram.
Step 4 — Proper Send Button (icon, not text)
Default send text = rookie mistake.
JavaScript
const renderSend = props => (
  <Send {...props}>
    <View
      style={{
        backgroundColor: '#002DE3',
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        marginBottom: 4,
      }}
    >
      <Icon name="send" size={18} color="#fff" />
    </View>
  </Send>
);
Now the typing bar visually connects with your blue message bubble.
Step 5 — Attach them to GiftedChat
Inside <GiftedChat /> add:
JavaScript
renderInputToolbar={renderInputToolbar}
renderComposer={renderComposer}
renderSend={renderSend}
alwaysShowSend
Step 6 — Add spacing from screen edges (tiny but important)
Modify KeyboardAvoidingView style:
JavaScript
container: {
  flex: 1,
  backgroundColor: '#fff',
  paddingBottom: 4,
},
Tiny detail → big polish difference.
Result you’ll get
Instead of a generic dev-looking chat input, you’ll have:
Floating modern typing bar
Rounded message field
Proper send FAB button
Visual consistency with bubbles
Real app vibe instead of tutorial vibe
If you want next-level polish, the next upgrades would be:
attachment button
voice message mic
typing indicator
read receipts
Right now your biggest UI weakness in this screen is the typing bar, and this fixes it properly.
