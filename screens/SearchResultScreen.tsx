// screens/SearchResultScreen.tsx
import React from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/_layout";

interface SearchResultScreenProps {
    favorites: { id: number; [key: string]: any }[];
    toggleFavorite: (repo: { id: number; [key: string]: any }) => void;
    repositories: { id: number; [key: string]: any }[];
    route: any;  // You can type this more specifically based on your needs
    navigation: any;  // You can type this more specifically as well
  }

type Props = {
  route: {
    params: {
      repositories: { id: number; [key: string]: any }[];
    };
  };
};

const SearchResultScreen: React.FC<SearchResultScreenProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "SearchResults">>();
  const { repositories } = route.params;

  const renderItem = ({ item }: { item: { id: number; [key: string]: any } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RepositoryDetails", { repository: item })}
    >
      <Text style={styles.repoName}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.repoDescription}>
        {item.description || "No description available"}
      </Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>⭐ {item.stargazers_count}</Text>
        <Text style={styles.infoText}>🍴 {item.forks_count}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={repositories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  repoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 12,
    color: "#333",
  },
});

export default SearchResultScreen;
