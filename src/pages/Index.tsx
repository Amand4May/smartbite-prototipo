import { useState, useCallback, useEffect } from 'react';
import { mockPets, mockFeederStatus, mockFeedingHistory, mockAlerts, mockDailyConsumption, api } from '@/lib/mock-data';
import { PetCard } from '@/components/PetCard';
import { FeederStatusCard } from '@/components/FeederStatusCard';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ConsumptionChart } from '@/components/ConsumptionChart';
import { FeedingHistory } from '@/components/FeedingHistory';
import { FeederControl } from '@/components/FeederControl';
import { PetForm } from '@/components/PetForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Auth } from '@/components/Auth';
import { AccountSettings } from '@/components/AccountSettings';
import { Onboarding } from '@/components/Onboarding';
import { PetProfile } from '@/components/PetProfile';
import { FeederSetup } from '@/components/FeederSetup';
import { ScheduleForm } from '@/components/ScheduleForm';
import { NotificationsCenter } from '@/components/NotificationsCenter';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Plus, LogOut, Settings, Bell, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'control' | 'settings' | 'pet-profile' | 'notifications' | 'notification-settings' | 'feeder-setup' | 'schedule';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  weight?: number;
  diet?: string;
  createdAt: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showPetForm, setShowPetForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const forceRefresh = useCallback(() => setRefreshKey(n => n + 1), []);

  // Carregar usuário do localStorage ao montar componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Verificar se completou onboarding
        const onboarding = JSON.parse(localStorage.getItem('onboarding') || '{}');
        if (!onboarding.completed) {
          setShowOnboarding(true);
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleDeletePet = async (id: string) => {
    const pet = mockPets.find(p => p.id === id);
    if (!pet) return;
    await api.deletePet(id);
    toast.success(`${pet.name} removido(a)`);
    forceRefresh();
  };

  // Se não há usuário autenticado, mostrar tela de Auth
  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  // Se não completou onboarding, mostrar guia
  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  // Header compartilhado
  const renderHeader = () => (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setTab('dashboard')} 
          className="flex flex-col gap-0.5 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <h1 className="text-lg font-bold text-foreground leading-tight">SmartBite</h1>
          </div>
          <p className="text-xs text-muted-foreground ml-1">Bem-vindo, {user?.name}!</p>
        </button>
        <div className="flex items-center gap-2">
          {tab === 'dashboard' && (
            <Button variant="ghost" size="icon" onClick={() => setShowPetForm(true)}>
              <Plus className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant={tab === 'notifications' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setTab(tab === 'notifications' ? 'dashboard' : 'notifications')}
            title="Notificações"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant={tab === 'settings' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setTab(tab === 'settings' ? 'dashboard' : 'settings')}
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
  if (tab === 'settings') {
    return (
      <div className="min-h-screen pb-24">
        {renderHeader()}
        <div className="mx-auto max-w-2xl px-4 py-5 space-y-5 pt-4">
          <AccountSettings 
            user={user} 
            onLogout={handleLogout} 
            onUserUpdate={handleUserUpdate}
          />
        </div>
      </div>
    );
  }

  if (tab === 'pet-profile' && selectedPet) {
    return (
      <div className="min-h-screen pb-24">
        {renderHeader()}
        <div className="mx-auto max-w-2xl px-4 py-5 space-y-5 pt-4">
          <PetProfile 
            pet={selectedPet}
            onBack={() => {
              setTab('dashboard');
              setSelectedPet(null);
            }}
            onUpdate={forceRefresh}
            onDelete={() => {
              setTab('dashboard');
              setSelectedPet(null);
              forceRefresh();
            }}
          />
        </div>
      </div>
    );
  }

  if (tab === 'notifications') {
    return (
      <div className="min-h-screen pb-24">
        {renderHeader()}
        <div className="mx-auto max-w-2xl px-4 py-5 space-y-5 pt-4">
          <NotificationsCenter 
            onBack={() => setTab('dashboard')}
            onGoToSettings={() => setTab('notification-settings')}
          />
        </div>
      </div>
    );
  }

  if (tab === 'notification-settings') {
    return (
      <div className="min-h-screen pb-24">
        {renderHeader()}
        <div className="mx-auto max-w-2xl px-4 py-5 space-y-5 pt-4">
          <NotificationSettings 
            onBack={() => setTab('dashboard')}
          />
        </div>
      </div>
    );
  }

  if (tab === 'feeder-setup') {
    return (
      <div className="min-h-screen pb-24">
        {renderHeader()}
        <div className="mx-auto max-w-2xl px-4 py-5 space-y-5 pt-4">
          <FeederSetup 
            onBack={() => setTab('dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 w-full overflow-x-hidden bg-white" key={refreshKey}>
      {renderHeader()}

      {/* Tabs */}
      {(tab === 'dashboard' || tab === 'control') && (
        <div className="sticky top-[57px] z-30 bg-background border-b">
          <div className="mx-auto max-w-2xl px-4 flex gap-1 py-1.5">
            {([
              ['dashboard', 'Dashboard'],
              ['control', 'Controle'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-5 space-y-5">
        {tab === 'settings' ? (
          user && <AccountSettings user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
        ) : tab === 'dashboard' ? (
          <>
            <ScrollReveal>
              <AlertsPanel alerts={mockAlerts} />
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <FeederStatusCard status={mockFeederStatus} />
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Meus Pets</h3>
                <div className="grid gap-2">
                  {mockPets.map(pet => (
                    <button
                      key={pet.id}
                      onClick={() => {
                        setSelectedPet(pet as Pet);
                        setTab('pet-profile');
                      }}
                      className="text-left hover:opacity-90 transition-opacity"
                    >
                      <PetCard pet={pet} onDelete={handleDeletePet} />
                    </button>
                  ))}
                  {mockPets.length === 0 && (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      Nenhum pet cadastrado. Adicione um para começar!
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <ConsumptionChart data={mockDailyConsumption} />
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <FeedingHistory records={mockFeedingHistory} />
            </ScrollReveal>
          </>
        ) : tab === 'control' ? (
          <>
            <div className="flex gap-2 mb-4">
              <Button 
                className="flex-1"
                onClick={() => setShowScheduleForm(true)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setTab('feeder-setup')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Conectar Alimentador
              </Button>
            </div>
            <ScrollReveal>
              <FeederControl pets={mockPets} />
            </ScrollReveal>
          </>
        ) : (
          <ScrollReveal>
            <FeederControl pets={mockPets} />
          </ScrollReveal>
        )}
      </main>

      {showPetForm && <PetForm onClose={() => setShowPetForm(false)} onAdded={forceRefresh} />}
      {showScheduleForm && <ScheduleForm onClose={() => setShowScheduleForm(false)} />}
    </div>
  );
};

export default Index;
