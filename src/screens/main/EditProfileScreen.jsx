import React, { useState, useEffect, useContext } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Pressable, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  useColorScheme as useRNColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, User, KeyRound } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  // Profile fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');

  // Password fields state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading and Error states
  const [saveLoading, setSaveLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  // Parse user phone number on load
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setEmail(user.email || '');

      // Parse phone number
      if (user.phone) {
        let clean = user.phone.replace('+', '');
        if (clean.startsWith('91') && clean.length > 10) {
          setCountryCode('91');
          setPhoneNo(clean.substring(2));
        } else if (clean.length === 10) {
          setCountryCode('91');
          setPhoneNo(clean);
        } else if (clean.length > 10) {
          const diff = clean.length - 10;
          setCountryCode(clean.substring(0, diff));
          setPhoneNo(clean.substring(diff));
        } else {
          setCountryCode('91');
          setPhoneNo(clean);
        }
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setProfileSuccessMsg('');
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoneNo = phoneNo.trim();
    const trimmedCountryCode = countryCode.trim().replace('+', '');

    if (!trimmedFirstName) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    if (!trimmedUsername || trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      Alert.alert('Validation Error', 'Username must be between 3 and 20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      Alert.alert('Validation Error', 'Username can only contain alphanumeric characters and underscores.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('Validation Error', 'Please provide a valid email address.');
      return;
    }
    if (!trimmedPhoneNo || !/^[0-9]{10}$/.test(trimmedPhoneNo)) {
      Alert.alert('Validation Error', 'Phone number must be exactly 10 digits.');
      return;
    }
    if (!trimmedCountryCode) {
      Alert.alert('Validation Error', 'Country code is required.');
      return;
    }

    const combinedPhone = `+${trimmedCountryCode}${trimmedPhoneNo}`;

    setSaveLoading(true);
    try {
      const res = await request('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          username: trimmedUsername,
          email: trimmedEmail,
          phone: combinedPhone,
        })
      });

      if (res.success) {
        setUser(res.data);
        setProfileSuccessMsg('Profile details successfully saved! 🎉');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      }
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordSuccessMsg('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
      return;
    }
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    if (!hasUpper || !hasNum || !hasSpecial) {
      Alert.alert(
        'Validation Error', 
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    setResetLoading(true);
    try {
      const res = await request('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword
        })
      });

      if (res.success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccessMsg('Password successfully updated! 🔐');
        setTimeout(() => setPasswordSuccessMsg(''), 4000);
      }
    } catch (err) {
      Alert.alert('Password Change Failed', err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between p-4 border-b"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingTop: insets.top > 0 ? insets.top + 10 : 20,
        }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="p-2 bg-slate-200 dark:bg-slate-900 rounded-full border"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
          }}
        >
          <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-widest">
          My Profile
        </Text>
        <View className="w-9" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Edit Profile Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4 px-1">
              <User size={16} color={isDark ? '#06B6D4' : '#0891B2'} style={{ marginRight: 6 }} />
              <Text className="text-slate-950 dark:text-white font-black text-sm uppercase tracking-wider">
                Edit Profile
              </Text>
            </View>

            <GlassCard className="p-4" glowColor="purple">
              {profileSuccessMsg !== '' && (
                <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 mb-4">
                  <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                    {profileSuccessMsg}
                  </Text>
                </View>
              )}

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    className="mb-3"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    className="mb-3"
                  />
                </View>
              </View>

              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                className="mb-3"
              />

              <View className="flex-row gap-3 mb-3">
                <View style={{ width: 80 }}>
                  <Input
                    label="Code"
                    value={countryCode}
                    onChangeText={text => {
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setCountryCode(cleaned);
                    }}
                    placeholder="91"
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Phone Number"
                    value={phoneNo}
                    onChangeText={text => {
                      const cleaned = text.replace(/[^0-9]/g, '');
                      setPhoneNo(cleaned);
                    }}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                className="mb-4"
              />

              <Button
                title="Save"
                onPress={handleSaveProfile}
                loading={saveLoading}
                className="w-full mt-2"
              />
            </GlassCard>
          </View>

          {/* Reset Password Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4 px-1">
              <KeyRound size={16} color={isDark ? '#06B6D4' : '#0891B2'} style={{ marginRight: 6 }} />
              <Text className="text-slate-950 dark:text-white font-black text-sm uppercase tracking-wider">
                Reset Password
              </Text>
            </View>

            <GlassCard className="p-4" glowColor="purple">
              {passwordSuccessMsg !== '' && (
                <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 mb-4">
                  <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                    {passwordSuccessMsg}
                  </Text>
                </View>
              )}

              <Input
                label="Old Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Old Password"
                secureTextEntry
                className="mb-3"
              />

              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                secureTextEntry
                className="mb-3"
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
                className="mb-4"
              />

              <Button
                title="Reset"
                onPress={handleResetPassword}
                loading={resetLoading}
                className="w-full mt-2"
              />
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
