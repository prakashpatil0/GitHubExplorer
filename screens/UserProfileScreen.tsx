import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

type RootStackParamList = {
  UserProfile: { userId: string };
};

type Props = {
  route: RouteProp<RootStackParamList, "UserProfile">;
};

const UserProfileScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const userId = route.params?.userId;
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [repoSearch, setRepoSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string>("");

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.headerIcon}
        />
      ),
    });
  }, [navigation]);

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      setError(null);
  
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userResponse.json();
  
      if (userData.message === "Not Found") {
        throw new Error("User not found. Please check the GitHub username.");
      }
  
      setUser(userData);
  
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      const reposData = await reposResponse.json();
  
      if (Array.isArray(reposData)) {
        setRepos(reposData);
        const totalStarsCount = reposData.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
        setTotalStars(totalStarsCount);
      } else {
        setRepos([]);
        setTotalStars(0);
      }
  
      const followersResponse = await fetch(`https://api.github.com/users/${username}/followers`);
      const followersData = await followersResponse.json();
      setFollowers(followersData);
  
      const followingResponse = await fetch(`https://api.github.com/users/${username}/following`);
      const followingData = await followingResponse.json();
      setFollowing(followingData);
  
      const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
      const eventsData = await eventsResponse.json();
      setRecentEvents(eventsData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch data.");
      } else {
        setError("Failed to fetch data.");
      }
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddGithubAccount = () => {
    if (githubUsername.trim()) {
      fetchUserData(githubUsername);
    } else {
      setError("Please enter a valid GitHub username.");
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#D27AD5" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.addAccountButton} onPress={() => setError(null)}>
          <Text style={styles.addAccountText}>Go Back and Fix</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter GitHub Username"
        value={githubUsername}
        onChangeText={setGithubUsername}
      />
      <TouchableOpacity style={styles.addAccountButton} onPress={handleAddGithubAccount}>
        <Text style={styles.addAccountText}>Add GitHub Account</Text>
      </TouchableOpacity>

      {user && (
        <>
          <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
          <Text style={styles.username}>{user?.login}</Text>
          <Text style={styles.bio}>{user?.bio || "No bio available"}</Text>
          <Text style={styles.details}>
            Public Repos: {user?.public_repos} | Followers: {user?.followers} | Following: {user?.following}
          </Text>

          <Text style={styles.stars}>Total Stars: {totalStars}</Text>

          <View style={styles.followSection}>
            <Text style={styles.followText}>Followers: {followers.length}</Text>
            <Text style={styles.followText}>Following: {following.length}</Text>
          </View>

          <Text style={styles.recentActivity}>Recent Activity</Text>
          <FlatList
            data={recentEvents.slice(0, 5)} // Display only the first 5 events
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventType}>{item.type}</Text>
                <Text style={styles.eventRepo}>{item.repo.name}</Text>
              </View>
            )}
            style={styles.flatList}
          />

          <Text style={styles.repoHeader}>Repositories</Text>
          <FlatList
            data={filteredRepos}
            keyExtractor={(repo, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.repoItem}>
                <Text style={styles.repoName}>{item.name}</Text>
                <Text style={styles.repoDescription}>{item.description || "No description"}</Text>
              </View>
            )}
            style={styles.flatList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerIcon: {
    marginRight: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#D27AD5",
    alignSelf: "center", // This will center the avatar horizontally
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center", // Ensures the text is centered
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginBottom: 12,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  stars: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D27AD5",
    marginBottom: 16,
  },
  followSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  followText: {
    fontSize: 16,
    color: "#444",
  },
  recentActivity: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  eventItem: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  eventType: {
    fontSize: 14,
    color: "#888",
  },
  eventRepo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  repoHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  repoItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D27AD5",
  },
  repoDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  input: {
    height: 40,
    borderColor: "#D27AD5",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 12,
  },
  addAccountButton: {
    backgroundColor: "#D27AD5",
    padding: 12,
    width: "60%",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  addAccountText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  flatList: {
    marginTop: 16,
  },
});

export default UserProfileScreen;
