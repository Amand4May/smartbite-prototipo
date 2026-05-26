type Language = 'pt-BR' | 'en-US';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  'pt-BR': {
    'morning': 'Manhã',
    'afternoon': 'Tarde',
    'evening': 'Noite',
    'castrated': 'Castrado',
    'not_castrated': 'Não castrado',
    'castration_date': 'Data de Castração',
    'castrated_at': 'Castrado em',
    'registered_at': 'Cadastrado em',
    'edit': 'Editar',
    'back': 'Voltar',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'weight': 'Peso',
    'age': 'Idade',
    'breed': 'Raça',
    'feeding_plan': 'Plano Alimentar',
    'food_type': 'Tipo de Ração',
    'not_configured': 'Nao configurado',
    'daily_amount': 'Quantidade diária (gramas)',
    'feeding_frequency': 'Frequência de alimentação',
    'save_feeding_plan': 'Salvar Plano Alimentar',
    'active_schedules': 'Agendamentos Ativos',
    'active': 'Ativo',
    'inactive': 'Inativo',
    'my_account': 'Minha Conta',
    'email': 'Email',
    'password': 'Senha',
    'update_email': 'Atualizar Email',
    'change_password': 'Alterar Senha',
    'current_password': 'Senha Atual',
    'new_password': 'Nova Senha',
    'confirm_password': 'Confirmar Senha',
    'preferences': 'Preferências',
    'theme': 'Tema',
    'light': 'Claro',
    'dark': 'Escuro',
    'language': 'Idioma',
    'portuguese_br': 'Português (Brasil)',
    'english_us': 'English (US)',
    'save_preferences': 'Salvar Preferências',
    'pet_name': 'Nome do Pet',
    'pet_type': 'Tipo',
    'dog': 'Cachorro',
    'cat': 'Gato',
    'overview': 'Visão Geral',
    'diet': 'Dieta',
    'history': 'Histórico',
    'weight_unit': 'Unidade de Peso',
    'kilograms': 'Quilogramas (kg)',
    'pounds': 'Libras (lb)',
    'offline_alerts': 'Alertas Offline',
    'help_legal': 'Ajuda & Legal',
    'important_information': 'Informações importantes sobre o SmartBite',
    'privacy_policy': 'Política de Privacidade',
    'terms_of_service': 'Termos de Serviço',
    'danger_zone': 'Zona de Perigo',
    'irreversible_actions': 'Ações que não podem ser desfeitas',
    'delete_account': 'Deletar Conta',
    'manage_personal_info': 'Gerencie suas informações pessoais',
    'personalize_experience': 'Personalize sua experiência no SmartBite',
  },
  'en-US': {
    'morning': 'Morning',
    'afternoon': 'Afternoon',
    'evening': 'Evening',
    'castrated': 'Neutered',
    'not_castrated': 'Not neutered',
    'castration_date': 'Neutering Date',
    'castrated_at': 'Neutered on',
    'registered_at': 'Registered on',
    'edit': 'Edit',
    'back': 'Back',
    'save': 'Save',
    'cancel': 'Cancel',
    'weight': 'Weight',
    'age': 'Age',
    'breed': 'Breed',
    'feeding_plan': 'Feeding Plan',
    'food_type': 'Food Type',
    'not_configured': 'Not configured',
    'daily_amount': 'Daily amount (grams)',
    'feeding_frequency': 'Feeding frequency',
    'save_feeding_plan': 'Save Feeding Plan',
    'active_schedules': 'Active Schedules',
    'active': 'Active',
    'inactive': 'Inactive',
    'my_account': 'My Account',
    'email': 'Email',
    'password': 'Password',
    'update_email': 'Update Email',
    'change_password': 'Change Password',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'confirm_password': 'Confirm Password',
    'preferences': 'Preferences',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'language': 'Language',
    'portuguese_br': 'Português (Brasil)',
    'english_us': 'English (US)',
    'save_preferences': 'Save Preferences',
    'pet_name': 'Pet Name',
    'pet_type': 'Type',
    'dog': 'Dog',
    'cat': 'Cat',
    'overview': 'Overview',
    'diet': 'Diet',
    'history': 'History',
    'weight_unit': 'Weight Unit',
    'kilograms': 'Kilograms (kg)',
    'pounds': 'Pounds (lb)',
    'offline_alerts': 'Offline Alerts',
    'help_legal': 'Help & Legal',
    'important_information': 'Important information about SmartBite',
    'privacy_policy': 'Privacy Policy',
    'terms_of_service': 'Terms of Service',
    'danger_zone': 'Danger Zone',
    'irreversible_actions': 'Actions that cannot be undone',
    'delete_account': 'Delete Account',
    'manage_personal_info': 'Manage your personal information',
    'personalize_experience': 'Personalize your SmartBite experience',
  },
};

let currentLanguage: Language = 'pt-BR';

export function setLanguage(language: Language) {
  currentLanguage = language;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: string): string {
  return translations[currentLanguage]?.[key] ?? key;
}

export function initializeLanguage() {
  const savedPreferences = localStorage.getItem('userPreferences');
  if (savedPreferences) {
    try {
      const preferences = JSON.parse(savedPreferences);
      if (preferences.language) {
        currentLanguage = preferences.language as Language;
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  }
}
