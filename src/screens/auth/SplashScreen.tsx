import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { SplashScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";
import { FontSize, Spacing } from "../../constants/index";

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuthStore();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const textOpacity = useSharedValue(0);
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 80 });
    opacity.value = withSpring(1, { damping: 12 });
    textOpacity.value = withDelay(600, withSpring(1));
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? "Main" : "Auth");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={Colors.gradient.admin} style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏛️</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.textBlock, textStyle]}>
        <Text style={styles.appName}>NMC Admin</Text>
        <Text style={styles.tagline}>Nellore Municipal Corporation</Text>
        <Text style={styles.sub}>Admin Dashboard</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  logoContainer: { alignItems: "center" },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  logoEmoji: { fontSize: 52 },
  textBlock: { alignItems: "center", gap: 6 },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: { fontSize: FontSize.md, color: "rgba(255,255,255,0.8)" },
  sub: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
});

export default SplashScreen;
