
import { useState } from 'react';

import {
    Heart,
    MapPin,
} from 'lucide-react-native';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const applications = [
  {
    id: 1,
    letter: 'S',
    title: 'Software Engineering Intern',
    company: 'SunLife',
    location: 'Makati City • On-site',
    date: 'Aug 20, 2026',
    status: 'Pending',
    statusColor: '#E59A00',
  },
  {
    id: 2,
    letter: 'P',
    title: 'Marketing Intern',
    company: 'Pspsps Media',
    location: 'Pasig City • Hybrid',
    date: 'Aug 15, 2026',
    status: 'Under Review',
    statusColor: '#E59A00',
  },
  {
    id: 3,
    letter: 'P',
    title: 'Graphic Design Intern',
    company: 'Pixel Studio',
    location: 'Taguig • Hybrid',
    date: 'Aug 12, 2026',
    status: 'Interview',
    statusColor: '#198B62',
  },
  {
    id: 4,
    letter: 'M',
    title: 'Business Analyst Intern',
    company: 'Mama Labs',
    location: 'BGC, Taguig • On-site',
    date: 'Aug 10, 2026',
    status: 'Rejected',
    statusColor: '#CC4949',
  },
];

export default function ApplicationsScreen() {
  const [selectedTab, setSelectedTab] = useState('Active');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Screen Title */}
        <Text style={styles.title}>My Applications</Text>

        {/* Active and Past Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'Active' && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab('Active')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Active' && styles.selectedTabText,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'Past' && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab('Past')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Past' && styles.selectedTabText,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Application Cards */}
        {selectedTab === 'Active' ? (
          applications.map((application) => (
            <View
              key={application.id}
              style={styles.applicationCard}
            >
              {/* Company Initial */}
              <View style={styles.companyIcon}>
                <Text style={styles.companyLetter}>
                  {application.letter}
                </Text>
              </View>

              {/* Application Information */}
              <View style={styles.applicationInfo}>
                <Text style={styles.jobTitle}>
                  {application.title}
                </Text>

                <Text style={styles.companyName}>
                  {application.company}
                </Text>

                <View style={styles.locationRow}>
                  <MapPin size={12} color="#7889A3" />

                  <Text style={styles.location}>
                    {application.location}
                  </Text>
                </View>

                <Text style={styles.applicationDate}>
                  Applied • {application.date}
                </Text>
              </View>

              {/* Favorite Icon */}
              <Heart size={22} color="#7889A3" />

              {/* Application Status */}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: application.statusColor },
                ]}
              >
                <Text style={styles.statusText}>
                  {application.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No past applications to display.
          </Text>
        )}

        {/* Application Tip */}
        <Text style={styles.tipHeading}>
          Application tip
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>
            Keep your profile and resume updated
          </Text>

          <Text style={styles.tipDescription}>
            to improve application readiness.
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
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 34,
  },

  tabContainer: {
    height: 42,
    backgroundColor: '#E8F0FA',
    borderRadius: 25,
    flexDirection: 'row',
    marginBottom: 22,
  },

  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },

  selectedTab: {
    backgroundColor: '#0D2D60',
  },

  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7889A3',
  },

  selectedTabText: {
    color: '#FFFFFF',
  },

  applicationCard: {
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 18,
    padding: 12,
    minHeight: 113,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    position: 'relative',
    paddingBottom: 38,
  },

  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0D2D60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  companyLetter: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },

  applicationInfo: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 5,
  },

  companyName: {
    fontSize: 13,
    color: '#7889A3',
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },

  location: {
    fontSize: 12,
    color: '#7889A3',
  },

  applicationDate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0D2D60',
  },

  statusBadge: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    minWidth: 82,
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  emptyText: {
    textAlign: 'center',
    color: '#7889A3',
    paddingVertical: 40,
  },

  tipHeading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172B4D',
    marginTop: 18,
    marginBottom: 20,
  },

  tipCard: {
    backgroundColor: '#E8F0FA',
    borderRadius: 18,
    padding: 20,
    minHeight: 90,
  },

  tipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D2D60',
    marginBottom: 8,
  },

  tipDescription: {
    fontSize: 13,
    color: '#7889A3',
  },
});
