import React from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { Button, Appbar, Card, useTheme } from "react-native-paper";

const FavoritesScreen = ({
  favorites,
  toggleFavorite,
  navigation,
}: {
  favorites: any[];
  toggleFavorite: (repo: any) => void;
  navigation: any;
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const RepositoryCard = ({ repo }: { repo: any }) => (
    <Card
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.outline },
      ]}
    >
      <Card.Title
        title={repo.name}
        subtitle={repo.owner.login}
        left={(props) => (
          <Image {...props} source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
        )}
        titleStyle={{ color: colors.onSurface }}
        subtitleStyle={{ color: colors.onSurface }}
      />
      <Card.Content>
        <Text style={[styles.description, { color: colors.onSurface }]}>
          {repo.description || "No description available."}
        </Text>
        <Text style={{ color: colors.onSurface }}>
          ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
        </Text>
        <Text style={{ color: colors.onSurface }}>
          Language: {repo.language || "N/A"}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => toggleFavorite(repo)} textColor={colors.primary}>
          Remove Favorite
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Appbar.Header style={[styles.appbar, { backgroundColor: "#D27AD5" }]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.onPrimary} />
        <Appbar.Content
          title="Favorites"
          style={styles.appbarContent}
          titleStyle={[styles.title, { color: colors.onPrimary }]} // Use theme colors
        />
      </Appbar.Header>
      <View style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RepositoryCard repo={item} />}
          ListEmptyComponent={
            <Text style={{ color: colors.onBackground, textAlign: "center" }}>
              No favorites added yet.
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  description: { marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  appbar: {
    elevation: 4,
  },
  appbarContent: {
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FavoritesScreen; 