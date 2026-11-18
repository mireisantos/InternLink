
import { useState } from 'react';

import {
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
  TouchableOpacity,
  View,
} from 'react-native';

const internships = [
  {
    id: 1,
    letter: 'C',
    title: 'Frontend Developer Intern',
    company: 'Cloud Tech',
    location: 'Makati City • On-site',
    category: 'Tech',
    allowance: false,
  },
  {
    id: 2,
    letter: 'P',
    title: 'Graphic Design Intern',
    company: 'Pixel Studio',
    location: 'Taguig • Hybrid',
    category: 'Design',
    allowance: true,
  },
  {
    id: 3,
    letter: 'M',
    title: 'Business Analyst Intern',
    company: 'Mama Labs',
    location: 'BGC, Taguig • On-site',
    category: 'Business',
    allowance: false,
  },
  {
    id: 4,
    letter: 'D',
    title: 'Data Science Intern',
    company: 'DataBridge PH',
    location: 'Quezon City • Hybrid',
    category: 'Tech',
    allowance: true,
  },
];

const categories = ['All', 'Tech', 'Marketing', 'Design', 'Business'];

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredInternships = internships.filter((internship) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      internship.category === selectedCategory;

    const matchesSearch =
      internship.title.toLowerCase().includes(searchText.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchText.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Internships</Text>
          <Heart size={22} color="#0D2D60" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#7889A3" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, company, or skills..."
            placeholderTextColor="#7889A3"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category &&
                  styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Internships */}
        <Text style={styles.sectionTitle}>
          Featured Internships
        </Text>

        {/* Internship Cards */}
        {filteredInternships.map((internship) => (
          <View key={internship.id} style={styles.internshipCard}>
            <View style={styles.companyIcon}>
              <Text style={styles.companyLetter}>
                {internship.letter}
              </Text>
            </View>

            <View style={styles.internshipInfo}>
              <Text style={styles.jobTitle}>
                {internship.title}
              </Text>

              <Text style={styles.companyName}>
                {internship.company}
              </Text>

              <View style={styles.locationRow}>
                <MapPin size={12} color="#7889A3" />
                <Text style={styles.jobLocation}>
                  {internship.location}
                </Text>
              </View>

              {internship.allowance && (
                <Text style={styles.allowance}>
                  Weekly Allowance
                </Text>
              )}
            </View>

            <Heart size={21} color="#7889A3" />
          </View>
        ))}

        {filteredInternships.length === 0 && (
          <Text style={styles.emptyText}>
            No internships found.
          </Text>
        )}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  searchContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#172B4D',
  },

  categoryScroll: {
    marginBottom: 18,
  },

  categoryContainer: {
    gap: 10,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  selectedCategory: {
    backgroundColor: '#0D2D60',
    borderColor: '#0D2D60',
  },

  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7889A3',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 14,
  },

  internshipCard: {
    borderWidth: 1,
    borderColor: '#D8E2F0',
    borderRadius: 16,
    padding: 12,
    minHeight: 113,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
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
    fontSize: 19,
    fontWeight: 'bold',
  },

  internshipInfo: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 5,
  },

  companyName: {
    fontSize: 12,
    color: '#7889A3',
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  jobLocation: {
    fontSize: 11,
    color: '#7889A3',
  },

  allowance: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#172B4D',
    marginTop: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#7889A3',
    marginTop: 30,
  },
});
