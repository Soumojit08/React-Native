import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React-Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "red",
    alignItems: "center",
    fontSize: 30,
  },
});
