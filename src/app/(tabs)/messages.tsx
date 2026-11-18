
import {
    PencilLine,
} from 'lucide-react-native';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const conversations = [
  {
    id: 1,
    letter: 'S',
    company: 'SunLife',
    message: "Hi! We're excited to move forward...",
    time: '10:24 AM',
  },
  {
    id: 2,
    letter: 'P',
    company: 'Pspsps Media',
    message: "Thanks for your application. We'll...",
    time: 'Yesterday',
  },
  {
    id: 3,
    letter: 'P',
    company: 'Pixel Studio',
    message: "Hi! We'd like to schedule an interview.",
    time: 'Aug 27',
  },
  {
    id: 4,
    letter: 'M',
    company: 'Mama Labs',
    message: 'Your application has been reviewed.',
    time: 'Aug 25',
  },
];

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>

          <PencilLine
            size={22}
            color="#082B5F"
          />
        </View>

        {/* Conversation List */}
        <View style={styles.conversationList}>
          {conversations.map((conversation) => (
            <View
              key={conversation.id}
              style={styles.messageCard}
            >
              {/* Company Initial */}
              <View style={styles.companyIcon}>
                <Text style={styles.companyLetter}>
                  {conversation.letter}
                </Text>
              </View>

              {/* Message Details */}
              <View style={styles.messageInfo}>
                <Text style={styles.companyName}>
                  {conversation.company}
                </Text>

                <Text
                  style={styles.messagePreview}
                  numberOfLines={1}
                >
                  {conversation.message}
                </Text>
              </View>

              {/* Message Time */}
              <Text style={styles.messageTime}>
                {conversation.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 56,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  conversationList: {
    gap: 13,
  },

  messageCard: {
    minHeight: 83,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 17,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  companyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#082B5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  companyLetter: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  messageInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 9,
  },

  messagePreview: {
    fontSize: 14,
    color: '#7889A3',
  },

  messageTime: {
    fontSize: 12,
    color: '#7889A3',
    marginLeft: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});
