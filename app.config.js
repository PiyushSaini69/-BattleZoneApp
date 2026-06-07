const fs = require('fs');
const path = require('path');

// Helper to load shared environment variables from parent root directory
function loadSharedEnv() {
  const env = {};
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = match[2] || '';
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          env[key] = val;
        }
      });
    }
  } catch (e) {
    console.warn('Warning: Failed to load shared environment config:', e.message);
  }
  return env;
}

const sharedEnv = loadSharedEnv();
const googleClientId = sharedEnv.GOOGLE_CLIENT_ID || '621490951518-3kn5eg4hpkvimqcrdiqk644d12evg243.apps.googleusercontent.com';
const reversedClientId = googleClientId.split('.').reverse().join('.');

module.exports = {
  expo: {
    name: "Battle Zone",
    slug: "battle-zone",
    scheme: "battlezone",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#060A13"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.battlezone.mobile"
    },
    android: {
      package: "com.battlezone.mobile",
      adaptiveIcon: {
        backgroundColor: "#060A13",
        foregroundImage: "./assets/logo.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-secure-store",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": reversedClientId
        }
      ],
      "@react-native-community/datetimepicker"
    ]
  }
};
