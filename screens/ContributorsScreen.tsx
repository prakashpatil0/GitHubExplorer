import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/_layout";
import { useTheme } from "react-native-paper"; // Import useTheme hook for theme

type Props = {
  route: RouteProp<RootStackParamList, "Contributors">;
};

const ContributorsScreen: React.FC<Props> = ({ route }) => {
  const { repoName } = route.params;
  const url = `https://api.github.com/repos/${repoName}/contributors`;

  const { colors } = useTheme(); // Fetch the current theme's colors

  type Contributor = {
    id: number;
    login: string;
  };

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Repository "${repoName}" not found.`);
          }
          throw new Error(`Failed to fetch contributors: ${response.statusText}`);
        }
    
        const data = await response.json();
        setContributors(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchContributors();
  }, [repoName]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface }}>Loading contributors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.onBackground }]}>Contributors for: {repoName}</Text>
      {contributors.length > 0 ? (
        <FlatList
          data={contributors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.contributorName, { color: colors.onSurface }]}>{item.login}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: colors.onBackground }}>No contributors available for this repository.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    marginTop: 8,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ContributorsScreen;
