import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  FlatList, 
  Image, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

// Game mode images in the requested order: br squad, br duo, br solo, clash squad, lone wolf
const CAROUSEL_IMAGES = [
  require('../../../assets/br_squad.jpg'),
  require('../../../assets/br_duo.jpg'),
  require('../../../assets/br_solo.jpg'),
  require('../../../assets/clash_squad.jpg'),
  require('../../../assets/lone_wolf.jpg')
];

export default function WelcomeScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollTimer = useRef(null);
  const isDragging = useRef(false);

  // Auto scroll effect
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentIndex]);

  const startAutoScroll = () => {
    stopAutoScroll();
    scrollTimer.current = setInterval(() => {
      if (isDragging.current) return;
      const nextIndex = (currentIndex + 1) % CAROUSEL_IMAGES.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3500);
  };

  const stopAutoScroll = () => {
    if (scrollTimer.current) {
      clearInterval(scrollTimer.current);
    }
  };

  const onMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.round(contentOffset / viewSize);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
    isDragging.current = false;
  };

  const onScrollBeginDrag = () => {
    isDragging.current = true;
  };

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#060A13' : '#F8FAFC' }]}>
      <StatusBar style={isDark ? "light" : "dark"} translucent />

      {/* Image Carousel Container */}
      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={CAROUSEL_IMAGES}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          getItemLayout={getItemLayout}
          renderItem={({ item }) => (
            <View style={styles.slideContainer}>
              <Image 
                source={item} 
                style={styles.backgroundImage} 
                resizeMode="cover"
              />
            </View>
          )}
        />
      </View>

      {/* Bottom Content Area */}
      <View style={styles.bottomContent}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {CAROUSEL_IMAGES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View 
                key={index}
                style={[
                  styles.dot, 
                  isActive ? styles.dotActive : styles.dotInactive,
                  { 
                    backgroundColor: isActive 
                      ? (isDark ? '#00E5FF' : '#7C3AED') 
                      : (isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)')
                  }
                ]}
              />
            );
          })}
        </View>

        {/* Headline */}
        <Text className="text-2xl font-black text-center text-slate-900 dark:text-white uppercase tracking-wider mb-6">
          Welcome To Battle Zone
        </Text>

        {/* Action Buttons (Log In left, Sign Up right) */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Log In"
              variant="primary"
              onPress={() => navigation.navigate('Login')}
              className="w-full"
              textClassName="text-xs font-extrabold text-white"
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Sign Up"
              variant="primary"
              onPress={() => navigation.navigate('Register')}
              className="w-full"
              textClassName="text-xs font-extrabold text-white"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselWrapper: {
    flex: 1,
  },
  slideContainer: {
    width: screenWidth,
    height: '100%',
    alignItems: 'center',
    paddingBottom: 16, // spacing right above dots
  },
  backgroundImage: {
    width: screenWidth - 32,
    flex: 1,
    borderRadius: 24,
    marginTop: 50, // spacing at top for status bar area
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotInactive: {
    width: 6,
  },
  dotActive: {
    width: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  buttonWrapper: {
    flex: 1,
  },
});
