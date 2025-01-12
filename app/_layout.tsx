import React, { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { View, TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";
import HomeScreen from "@/screens/HomeScreen";
import FavoritesScreen from "@/screens/FavoritesScreen";
import ContributorsScreen from "@/screens/ContributorsScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import SearchResultScreen from "@/screens/SearchResultScreen";
import RepositoryDetailsScreen from "@/screens/RepositoryDetailsScreen";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "@/screens/themeContext";

// Define types for navigation parameters
export type RootStackParamList = {
  Home: undefined;
  SearchResults: { repositories: { id: number; [key: string]: any }[] };
  RepositoryDetails: { repository: { id: number; [key: string]: any } };
  Favorites: { favorites: { id: number; [key: string]: any }[] };
  Contributors: { repoName: string };
  UserProfile: { userId: string };
};

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

// Helper function to determine icon name based on route name
const getTabIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case "HomeTab":
      return "home";
    case "Favorites":
      return "heart";
    case "Contributors":
      return "people";
    case "UserProfile":
      return "person";
    default:
      return "help-circle";
  }
};

const App = () => {
  const [favorites, setFavorites] = useState<{ id: number; [key: string]: any }[]>([]);
  const [repositories, setRepositories] = useState<{ id: number; [key: string]: any }[]>([]);
  const [query, setQuery] = useState<string>("");

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const toggleFavorite = (repo: { id: number; [key: string]: any }) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === repo.id)
        ? prevFavorites.filter((fav) => fav.id !== repo.id)
        : [...prevFavorites, repo]
    );
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
      const data = await response.json();
      setRepositories(data.items || []);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const MainStackNavigator = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: darkMode ? "#333" : "#D27AD5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          options={{
            headerTitle: () => (
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 24,
                  color: "#fff",
                }}
              >
                GitHub Explorer
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
                <Ionicons
                  name={darkMode ? "moon" : "sunny"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            ),
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              repositories={repositories}
              fetchRepositories={fetchRepositories}
              query={query}
              setQuery={setQuery}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="SearchResults"
          options={{
            title: "Search Results",
          }}
        >
          {(props) => (
            <SearchResultScreen
              {...props}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              repositories={repositories}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="RepositoryDetails"
          component={RepositoryDetailsScreen}
          options={{
            title: "Repository Details",
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <ThemeProvider>
      <PaperProvider>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: "#D27AD5",
                height: 70,
              },
              tabBarItemStyle: {
                justifyContent: "center",
                alignItems: "center",
                height: 60,
                width: 100,
                marginHorizontal: 5,
                borderRadius: 8,
              },
              tabBarIcon: ({ focused, color, size }) => {
                const iconName = getTabIconName(route.name);
                return (
                  <Ionicons
                    name={iconName}
                    size={size}
                    color={focused ? "white" : color}
                  />
                );
              },
              tabBarActiveBackgroundColor: "#D27AD5",
              tabBarActiveTintColor: "white",
              tabBarInactiveTintColor: "black",
              tabBarLabelStyle: {
                fontSize: 12,
              },
              tabBarButton: (props) => (
                <View
                  style={{
                    backgroundColor: props.accessibilityState?.selected
                      ? "#D27AD5"
                      : "transparent",
                    borderRadius: 8,
                    padding: 4,
                  }}
                >
                  <TouchableOpacity {...(props as TouchableOpacityProps)} />
                </View>
              ),
            })}
          >
            <Tab.Screen name="HomeTab" component={MainStackNavigator} />
            <Tab.Screen
              name="Favorites"
              options={{ title: "Favorites" }}
            >
              {(props) => (
                <FavoritesScreen
                  {...props}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Contributors"
              options={{ title: "Contributors" }}
            >
              {(props) => (
                <ContributorsScreen
                  {...props}
                  route={{
                    ...props.route,
                    params: { repoName: "someRepoName" },
                  }}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name="UserProfile"
              options={{ title: "User Profile" }}
            >
              {(props) => (
                <UserProfileScreen
                  {...props}
                  route={{
                    ...props.route,
                    params: { userId: "someUserId" },
                  }}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default App;
