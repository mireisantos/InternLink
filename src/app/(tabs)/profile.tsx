
import {
    ChevronRight,
    CircleHelp,
    Heart,
    Settings,
    Square,
    UserRoundPen,
} from 'lucide-react-native';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const menuItems = [
  {
    id: 1,
    title: 'My Profile',
    icon: UserRoundPen,
  },
  {
    id: 2,
    title: 'My Applications',
    icon: Square,
  },
  {
    id: 3,
    title: 'Saved Internships',
    icon: Heart,
  },
  {
    id: 4,
    title: 'Settings',
    icon: Settings,
  },
  {
    id: 5,
    title: 'Help & Support',
    icon: CircleHelp,
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Text style={styles.heading}>Profile</Text>

        {/* Profile Information */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>

          <Text style={styles.name}>Juan Dela Cruz</Text>

          <Text style={styles.email}>juan@email.com</Text>

          <Text style={styles.course}>
            BS Computer Science • iAcademy Nexus
          </Text>
        </View>

        {/* Profile Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Icon
                    size={19}
                    color="#082B5F"
                    strokeWidth={2.5}
                  />

                  <Text style={styles.menuTitle}>
                    {item.title}
                  </Text>
                </View>

                <ChevronRight
                  size={20}
                  color="#7889A3"
                />
              </View>
            );
          })}
        </View>

        {/* Internship Profile Strength */}
        <View style={styles.strengthCard}>
          <Text style={styles.strengthTitle}>
            Internship profile strength
          </Text>

          <View style={styles.progressRow}>
            <View style={styles.progressBackground}>
              <View style={styles.progressFill} />
            </View>

            <Text style={styles.percentage}>82%</Text>
          </View>
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
    paddingTop: 16,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 36,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#082B5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  avatarText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 6,
  },

  email: {
    fontSize: 12,
    color: '#7889A3',
    marginBottom: 8,
  },

  course: {
    fontSize: 11,
    color: '#7889A3',
    textAlign: 'center',
  },

  menuContainer: {
    gap: 12,
  },

  menuItem: {
    height: 56,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  strengthCard: {
    backgroundColor: '#E8F0FA',
    borderRadius: 13,
    padding: 18,
    marginTop: 30,
    height: 73,
    justifyContent: 'center',
  },

  strengthTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#082B5F',
    marginBottom: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  progressBackground: {
    flex: 1,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    width: '82%',
    height: '100%',
    backgroundColor: '#082B5F',
    borderRadius: 10,
  },

  percentage: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#082B5F',
  },
});
