import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app/_layout"; // Adjust according to your directory structure
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

type Props = {
  route: RouteProp<RootStackParamList, "RepositoryDetails">;
  navigation: any; // Adjust the type for navigation if necessary
};

const RepositoryDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { repository } = route.params;

  // Ensure you pass the full name of the repository (e.g., 'facebook/react')
  const handleViewContributors = () => {
    navigation.navigate("Contributors", { repoName: repository.full_name });
  };

  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: repository.owner.avatar_url }} style={styles.avatar} />
        <Text style={[styles.repoName, { fontFamily: "Poppins_700Bold" }]}>
          {repository.name}
        </Text>
        <Text style={styles.ownerName}>Owner: {repository.owner.login}</Text>
      </View>

      <Text style={styles.description}>{repository.description || "No description available"}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>⭐ Stars: {repository.stargazers_count}</Text>
        <Text style={styles.infoText}>🍴 Forks: {repository.forks_count}</Text>
      </View>

      <Text style={styles.infoText}>Primary Language: {repository.language || "Not specified"}</Text>

      <View style={styles.additionalInfo}>
        <Text style={styles.infoText}>Created At: {new Date(repository.created_at).toLocaleDateString()}</Text>
        <Text style={styles.infoText}>Last Updated: {new Date(repository.updated_at).toLocaleDateString()}</Text>
      </View>

      {/* Custom button with Poppins font */}
      <TouchableOpacity style={styles.button} onPress={handleViewContributors}>
        <Text style={styles.buttonText}>View Contributors</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  repoName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ownerName: {
    fontSize: 18,
    color: "#555",
  },
  description: {
    fontSize: 16,
    marginVertical: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  additionalInfo: {
    marginTop: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
});

export default RepositoryDetailsScreen;
