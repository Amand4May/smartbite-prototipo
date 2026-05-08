import {
  Alert,
  DailyConsumption,
  FeederStatus,
  FeedingRecord,
  FeedingSchedule,
  Pet,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'smartbite_token';

type ApiUser = {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  user: ApiUser;
  token: string;
};

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = 'Erro ao conectar com a API.';
    try {
      const data = await response.json();
      message = data.detail ?? Object.values(data).flat().join(' ');
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

function toUser(user: ApiUser): AuthUser {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return {
    id: String(user.id),
    name: fullName || user.username || user.email,
    email: user.email,
  };
}

function toPet(data: any): Pet {
  return {
    id: data.id,
    name: data.name,
    species: data.species,
    breed: data.breed,
    weight: Number(data.weight),
    age: Number(data.age),
    activityLevel: data.activity_level,
    feedingGoal: data.feeding_goal,
    avatarEmoji: data.avatar_emoji,
    dailyRecommendedGrams: data.daily_recommended_grams,
    createdAt: data.created_at,
  };
}

function fromPet(pet: Omit<Pet, 'id' | 'avatarEmoji' | 'dailyRecommendedGrams' | 'createdAt'>) {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    weight: pet.weight,
    age: pet.age,
    activity_level: pet.activityLevel,
    feeding_goal: pet.feedingGoal,
    avatar_emoji: pet.species === 'dog' ? '🐕' : '🐱',
  };
}

function toFeeder(data: any): FeederStatus & { id: string; petId?: string | null } {
  return {
    id: data.id,
    petId: data.pet,
    online: data.online,
    deviceState: data.device_state,
    foodLevelPercent: data.food_level_percent,
    lastFeedingAt: data.last_feeding_at ? new Date(data.last_feeding_at) : null,
    lastFeedingAmount: data.last_feeding_amount,
    wifiSignal: data.wifi_signal,
    lastSyncAt: data.last_sync_at ? new Date(data.last_sync_at) : new Date(),
    motorStatus: data.motor_status,
    estimatedDaysRemaining: data.estimated_days_remaining,
    firmwareVersion: data.firmware_version,
  };
}

function emptyFeeder(): FeederStatus {
  return {
    online: false,
    deviceState: 'offline',
    foodLevelPercent: 0,
    lastFeedingAt: null,
    lastFeedingAmount: 0,
    wifiSignal: 0,
    lastSyncAt: new Date(),
    motorStatus: 'unknown',
    estimatedDaysRemaining: 0,
    firmwareVersion: '0.0.0',
  };
}

function toRecord(data: any): FeedingRecord {
  return {
    id: data.id,
    petId: data.pet,
    petName: data.pet_name,
    timestamp: new Date(data.timestamp),
    amountGrams: data.amount_grams,
    type: data.feeding_type,
  };
}

function toSchedule(data: any): FeedingSchedule {
  return {
    id: data.id,
    petId: data.pet,
    time: String(data.time).slice(0, 5),
    amountGrams: data.amount_grams,
    enabled: data.enabled,
    days: data.days ?? [],
  };
}

function toAlert(data: any): Alert {
  return {
    id: data.id,
    type: data.alert_type,
    severity: data.severity,
    message: data.message,
    timestamp: new Date(data.timestamp),
    read: data.read,
    dismissed: data.dismissed,
  };
}

export const api = {
  async login(email: string, password: string) {
    const data = await request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    saveAuthToken(data.token);
    return toUser(data.user);
  },

  async register(name: string, email: string, password: string, confirmPassword: string) {
    const [firstName, ...rest] = name.trim().split(/\s+/);
    const username = email.split('@')[0];
    const data = await request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        first_name: firstName,
        last_name: rest.join(' '),
        password,
        confirm_password: confirmPassword,
      }),
    });
    saveAuthToken(data.token);
    return toUser(data.user);
  },

  async logout() {
    try {
      await request('/auth/logout/', { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  getPets: async () => (await request<any[]>('/pets/')).map(toPet),

  addPet: async (pet: Omit<Pet, 'id' | 'avatarEmoji' | 'dailyRecommendedGrams' | 'createdAt'>) =>
    toPet(await request('/pets/', { method: 'POST', body: JSON.stringify(fromPet(pet)) })),

  updatePet: async (id: string, updates: Partial<Pet>) =>
    toPet(await request(`/pets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: updates.name,
        breed: updates.breed,
        weight: updates.weight,
        age: updates.age,
        activity_level: updates.activityLevel,
        feeding_goal: updates.feedingGoal,
      }),
    })),

  deletePet: async (petId: string) => request(`/pets/${petId}/`, { method: 'DELETE' }),

  async getFeederStatus() {
    const feeders = await request<any[]>('/feeders/');
    return feeders.length ? toFeeder(feeders[0]) : emptyFeeder();
  },

  async setupFeeder(serialNumber: string, name: string, petId?: string) {
    return toFeeder(await request('/feeders/setup/', {
      method: 'POST',
      body: JSON.stringify({ serial_number: serialNumber, name, pet_id: petId || null }),
    }));
  },

  async triggerManualFeed(petId: string, amount: number) {
    const feeders = (await request<any[]>('/feeders/')).map(toFeeder);
    let feeder = feeders.find(item => item.petId === petId) ?? feeders[0];

    if (!feeder) {
      feeder = await api.setupFeeder('SMARTBITE-DEMO-001', 'Comedouro SmartBite', petId);
    }

    await request(`/feeders/${feeder.id}/dispense/`, {
      method: 'POST',
      body: JSON.stringify({ amount_grams: amount }),
    });
    return { success: true };
  },

  getFeedingHistory: async (petId: string) =>
    (await request<any[]>(`/pets/${petId}/history/`)).map(toRecord),

  getDailyConsumption: async (petId: string, days = 7): Promise<DailyConsumption[]> =>
    (await request<any[]>(`/pets/${petId}/consumption/?days=${days}`)).map(item => ({
      date: new Date(`${item.date}T00:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }),
      recommended: item.recommended,
      served: item.served,
    })),

  getSchedules: async (petId: string) =>
    (await request<any[]>(`/pets/${petId}/schedules/`)).map(toSchedule),

  addSchedule: async (schedule: Omit<FeedingSchedule, 'id'>) =>
    toSchedule(await request(`/pets/${schedule.petId}/schedules/`, {
      method: 'POST',
      body: JSON.stringify({
        time: schedule.time,
        amount_grams: schedule.amountGrams,
        enabled: schedule.enabled,
        days: schedule.days,
      }),
    })),

  updateSchedule: async (id: string, updates: Partial<Omit<FeedingSchedule, 'id'>>) =>
    toSchedule(await request(`/schedules/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        time: updates.time,
        amount_grams: updates.amountGrams,
        enabled: updates.enabled,
        days: updates.days,
      }),
    })),

  deleteSchedule: async (id: string) => request(`/schedules/${id}/`, { method: 'DELETE' }),

  toggleSchedule: async (schedule: FeedingSchedule) =>
    api.updateSchedule(schedule.id, { enabled: !schedule.enabled }),

  getAlerts: async () => (await request<any[]>('/alerts/')).map(toAlert),
  dismissAlert: async (alertId: string) => request(`/alerts/${alertId}/dismiss/`, { method: 'POST' }),
  markAlertRead: async (alertId: string) => request(`/alerts/${alertId}/read/`, { method: 'POST' }),
};
