
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';  // Import StackNavigationProp
import { useTheme } from "@/screens/themeContext";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

type RootStackParamList = {
  Home: undefined;
  RepositoryDetails: { repository: { id: number; [key: string]: any } };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>; // Navigation prop for Home screen

type Props = {
  favorites: { id: number; [key: string]: any }[];
  toggleFavorite: (repo: { id: number; [key: string]: any }) => void;
  repositories: { id: number; [key: string]: any }[];
  fetchRepositories: () => Promise<void>;
  query: string;
  setQuery: (query: string) => void;
};

const HomeScreen: React.FC<Props> = ({
  favorites,
  toggleFavorite,
  repositories,
  fetchRepositories,
  query,
  setQuery,
}) => {
  const { darkMode } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Type the navigation object
  const [text, setText] = useState(query);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleSearchSubmit = () => {
    if (text.trim() === "") {
      alert("Please enter a search term.");
      return;
    }
    setQuery(text); 
    fetchRepositories();
    Keyboard.dismiss();
  };

  const handleRepositoryPress = (repository: { id: number; [key: string]: any }) => {
    navigation.navigate("RepositoryDetails", { repository });  
  };

  const containerStyle = darkMode ? styles.darkContainer : styles.lightContainer;
  const inputStyle = darkMode ? styles.darkInput : styles.lightInput;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, { fontFamily: "Poppins_700Bold" }]}>GitHub Repository Search</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={text}
          onChangeText={(input) => setText(input)}
          placeholder="Search repositories..."
          style={[styles.input, inputStyle, { fontFamily: "Poppins_400Regular" }]}
          placeholderTextColor={darkMode ? "#ddd" : "#888"}
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
          <Text style={[styles.searchButtonText, { fontFamily: "Poppins_700Bold" }]}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={repositories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, darkMode && styles.darkCard]}
            onPress={() => handleRepositoryPress(item)}  // Trigger navigation on repository click
          >
            <Text style={[styles.repoName, { fontFamily: "Poppins_700Bold" }]}>{item.name}</Text>
            <Text style={[styles.description, { fontFamily: "Poppins_400Regular" }]}>{item.description || "No description available"}</Text>
            <Text style={[styles.stars, { fontFamily: "Poppins_400Regular" }]}>⭐ {item.stargazers_count} Stars</Text>
            <TouchableOpacity
              style={[styles.favoriteButton, darkMode && styles.darkButton]}
              onPress={() => toggleFavorite(item)}
            >
              <Text style={styles.favoriteButtonText}>
                {favorites.some((fav) => fav.id === item.id) ? "Unfavorite" : "Favorite"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
    color: "#444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
  },
  lightInput: {
    backgroundColor: "#fff",
    color: "#000",
  },
  darkInput: {
    backgroundColor: "#555",
    color: "#fff",
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#D27AD5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    fontSize: 14,
    color: "#fff",
  },
  list: {
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#444",
  },
  repoName: {
    fontSize: 18,
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  stars: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  favoriteButton: {
    backgroundColor: "#D27AD5",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  darkButton: {
    backgroundColor: "#AA66CC",
  },
  favoriteButtonText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default HomeScreen;
