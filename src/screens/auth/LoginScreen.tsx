import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAuthStore } from "../../store/authStore";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

const LoginScreen: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    btnScale.value = withSpring(0.97, {}, () => {
      btnScale.value = withSpring(1);
    });
    await login(username.trim(), password);
  };

  const demoCredentials = [
    {
      label: "Municipal Commissioner",
      username: "admin",
      password: "admin123",
    },
    { label: "Ward Corporator", username: "corporator1", password: "admin123" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Yellow Hero with Corporator */}
        <View style={styles.hero}>
          <View style={styles.corpImgWrapper}>
            <Image
              source={require("../../../assets/images/corporator.png")}
              style={styles.corpImg}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.heroTitle}>Admin Portal</Text>
          <Text style={styles.heroName}>Ramakrishna</Text>
          <Text style={styles.heroRole}>47th Ward Corporator • TDP</Text>
          <Text style={styles.heroSub}>Nellore Municipal Corporation</Text>
          <View style={styles.wave} />
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSub}>
            Restricted access — authorized personnel only
          </Text>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.textTertiary}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={Colors.textTertiary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={Colors.textTertiary}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPwd}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPwd((v) => !v)}>
                <Ionicons
                  name={showPwd ? "eye-off" : "eye"}
                  size={18}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Animated.View style={btnStyle}>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginBtnWrapper}
            >
              <View style={styles.loginBtn}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#fff" />
                    <Text style={styles.loginBtnText}>Sign In Securely</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Demo Credentials */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            {demoCredentials.map((cred) => (
              <TouchableOpacity
                key={cred.username}
                style={styles.demoCard}
                onPress={() => {
                  setUsername(cred.username);
                  setPassword(cred.password);
                }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
                <View style={styles.demoInfo}>
                  <Text style={styles.demoLabel}>{cred.label}</Text>
                  <Text style={styles.demoCreds}>
                    {cred.username} / {cred.password}
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward-circle"
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  wrapper: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1 },
  // ── Hero ───────────────────────────────────────────────────────
  hero: {
    backgroundColor: Colors.primary,
    paddingTop: 24,
    paddingBottom: 72,
    alignItems: "center",
    gap: 4,
  },
  corpImgWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: Colors.dark,
    marginBottom: 10,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  corpImg: { width: "100%", height: "100%" },
  heroTitle: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: "#7A5200",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroName: { fontSize: FontSize.xxxl, fontWeight: "900", color: Colors.dark },
  heroRole: { fontSize: FontSize.sm, fontWeight: "700", color: "#7A5200" },
  heroSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  form: { flex: 1, padding: Spacing.lg, maxWidth: 500, width: "100%", alignSelf: "center" },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  formSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: Colors.surface,
    height: 52,
  },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: Spacing.md,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  loginBtnWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  loginBtn: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
  },
  loginBtnText: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
  demoSection: { gap: 10 },
  demoTitle: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  demoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoInfo: { flex: 1 },
  demoLabel: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  demoCreds: { fontSize: FontSize.xs, color: Colors.textSecondary },
});

export default LoginScreen;
