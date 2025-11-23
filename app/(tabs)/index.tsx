import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { fetchWeatherData } from '@/utils/weather-api';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({ light: '#F8F9FA', dark: '#1F1F1F' }, 'background');
  const inputBackground = useThemeColor({ light: '#FFFFFF', dark: '#2A2A2A' }, 'background');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#3A3A3A' }, 'background');
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'text');
  const shadowColor = useThemeColor({ light: '#000', dark: '#000' }, 'text');
  const dividerColor = useThemeColor({ light: 'rgba(0, 0, 0, 0.1)', dark: 'rgba(255, 255, 255, 0.1)' }, 'text');

  const handleSearch = async () => {
    if (!city.trim()) {
      Alert.alert('Erro', 'Por favor, digite o nome de uma cidade');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWeatherData(city.trim());
      setWeatherData(data);
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Não foi possível buscar a previsão do tempo. Verifique sua conexão e tente novamente.'
      );
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    // Mapeia códigos de ícone da OpenWeatherMap para ícones do Ionicons
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      '01d': 'sunny',
      '01n': 'moon',
      '02d': 'partly-sunny',
      '02n': 'cloudy-night',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloudy',
      '04n': 'cloudy',
      '09d': 'rainy',
      '09n': 'rainy',
      '10d': 'rainy',
      '10n': 'rainy',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'water',
      '50n': 'water',
    };
    return iconMap[iconCode] || 'partly-sunny';
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.header}>
          <ThemedView style={styles.iconContainer}>
            <Ionicons name="partly-sunny" size={48} color={tintColor} />
          </ThemedView>
          <ThemedText type="title" style={styles.title}>Previsão do Tempo</ThemedText>
          <ThemedText style={styles.subtitle}>
            Digite o nome da cidade para ver a previsão
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <ThemedView style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color={placeholderColor} style={styles.inputIcon} />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              placeholder="Digite o nome da cidade"
              placeholderTextColor={placeholderColor}
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </ThemedView>
          <TouchableOpacity
            style={[
              styles.button,
              { 
                backgroundColor: '#0a7ea4',
                shadowColor: shadowColor,
                ...Platform.select({
                  ios: {
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              },
            ]}
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.buttonText}>Buscar</Text>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>

        {weatherData && (
          <ThemedView 
            style={[
              styles.weatherCard, 
              { 
                backgroundColor: cardBackground,
                shadowColor: shadowColor,
                ...Platform.select({
                  ios: {
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              },
            ]}
          >
            <ThemedView style={styles.weatherIconContainer}>
              <Ionicons
                name={getWeatherIcon(weatherData.icon)}
                size={100}
                color={tintColor}
              />
            </ThemedView>
            
            <ThemedView style={styles.temperatureContainer}>
              <ThemedText type="title" style={styles.temperature}>
                {Math.round(weatherData.temperature)}°
              </ThemedText>
              <ThemedText style={styles.celsius}>C</ThemedText>
            </ThemedView>

            <ThemedView 
              style={[
                styles.divider,
                { backgroundColor: dividerColor }
              ]} 
            />

            <ThemedText type="subtitle" style={styles.cityName}>
              {weatherData.city}
            </ThemedText>

            <ThemedText style={styles.description}>
              {weatherData.description}
            </ThemedText>
          </ThemedView>
        )}

        {!weatherData && !loading && (
          <ThemedView style={styles.emptyState}>
            <ThemedView style={styles.emptyIconContainer}>
              <Ionicons name="cloud-outline" size={100} color={borderColor} style={styles.emptyIcon} />
            </ThemedView>
            <ThemedText style={styles.emptyTitle}>Nenhuma busca realizada</ThemedText>
            <ThemedText style={styles.emptyText}>
              Digite uma cidade e clique em buscar para ver a previsão do tempo
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 15,
  },
  searchContainer: {
    marginBottom: 32,
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingLeft: 48,
    fontSize: 16,
    flex: 1,
  },
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  weatherCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  weatherIconContainer: {
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    lineHeight: 72,
  },
  celsius: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: 8,
    opacity: 0.7,
  },
  divider: {
    width: '40%',
    height: 1,
    marginVertical: 24,
  },
  cityName: {
    marginBottom: 12,
    textTransform: 'capitalize',
    fontSize: 24,
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
    textAlign: 'center',
    opacity: 0.75,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyIcon: {
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
    fontSize: 15,
  },
});
