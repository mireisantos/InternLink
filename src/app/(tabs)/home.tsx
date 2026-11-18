
import {
  ArrowRight,
  GraduationCap,
  Heart,
  MapPin,
  Search,
} from 'lucide-react-native';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>JD 👋</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={19} color="#7889A3" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search internships..."
            placeholderTextColor="#7889A3"
          />
        </View>

        {/* Promotional Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              Your next step
              {'\n'}
              starts here.
            </Text>

            <Text style={styles.bannerDescription}>
              Explore internships, build your skills,
              and get closer to your goals.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <ArrowRight size={24} color="#0D2D60" />
          </View>
        </View>

        {/* Recommended Internships */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recommended for you
          </Text>

          <Text style={styles.seeAll}>See all</Text>
        </View>

        {/* Internship Card 1 */}
        <View style={styles.internshipCard}>
          <View style={styles.companyIcon}>
            <Text style={styles.companyLetter}>N</Text>
          </View>

          <View style={styles.internshipInfo}>
            <Text style={styles.jobTitle}>
              Software Engineering Intern
            </Text>

            <Text style={styles.companyName}>SunLife</Text>

            <View style={styles.locationRow}>
              <MapPin size={13} color="#7889A3" />
              <Text style={styles.jobLocation}>
                Makati City • On-site
              </Text>
            </View>
          </View>

          <Heart size={22} color="#7889A3" />
        </View>

        {/* Internship Card 2 */}
        <View style={styles.internshipCard}>
          <View style={styles.companyIcon}>
            <Text style={styles.companyLetter}>P</Text>
          </View>

          <View style={styles.internshipInfo}>
            <Text style={styles.jobTitle}>
              Marketing Intern
            </Text>

            <Text style={styles.companyName}>
              Pspsps Media
            </Text>

            <View style={styles.locationRow}>
              <MapPin size={13} color="#7889A3" />
              <Text style={styles.jobLocation}>
                Pasig City • Hybrid
              </Text>
            </View>

            <Text style={styles.allowance}>
              Weekly Allowance
            </Text>
          </View>

          <Heart size={22} color="#7889A3" />
        </View>

        {/* Why InternLink */}
        <Text style={styles.sectionTitle}>
          Why InternLink?
        </Text>

        <View style={styles.whyCard}>
          <View style={styles.whyTitleRow}>
            <GraduationCap size={19} color="#0D2D60" />

            <Text style={styles.whyTitle}>
              Internship-first
            </Text>
          </View>

          <Text style={styles.whyDescription}>
            Track applications, interviews, and offers
          </Text>
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
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 26,
  },

  greeting: {
    fontSize: 15,
    color: '#7889A3',
  },

  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  searchContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 22,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#172B4D',
  },

  banner: {
    backgroundColor: '#0D2D60',
    borderRadius: 18,
    padding: 22,
    minHeight: 155,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  bannerText: {
    flex: 1,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  bannerDescription: {
    color: '#D8E2F0',
    fontSize: 13,
    lineHeight: 20,
  },

  arrowCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 14,
  },

  seeAll: {
    color: '#0D2D60',
    fontWeight: 'bold',
    fontSize: 13,
  },

  internshipCard: {
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 17,
    padding: 12,
    minHeight: 126,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  companyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0D2D60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  companyLetter: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },

  internshipInfo: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 5,
  },

  companyName: {
    fontSize: 14,
    color: '#7889A3',
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  jobLocation: {
    fontSize: 12,
    color: '#7889A3',
  },

  allowance: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#172B4D',
    marginTop: 8,
  },

  whyCard: {
    backgroundColor: '#E8F0FA',
    borderRadius: 18,
    padding: 22,
    marginTop: 0,
  },

  whyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },

  whyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0D2D60',
  },

  whyDescription: {
    fontSize: 13,
    color: '#7889A3',
  },
});
