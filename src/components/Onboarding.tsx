import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronRight, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Species } from '@/lib/types';

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'pet' | 'feeder';

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [petData, setPetData] = useState<{ name: string; species: Species; breed: string; age: string; isNeutered: boolean; neuteredDate: string }>({ name: '', species: 'dog', breed: '', age: '', isNeutered: false, neuteredDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPet = async () => {
    if (!petData.name || !petData.breed || !petData.age) {
      toast.error('Por favor, preencha todos os campos do pet');
      return;
    }

    if (petData.isNeutered && !petData.neuteredDate) {
      toast.error('Por favor, selecione a data de castração');
      return;
    }

    setIsLoading(true);
    try {
      await api.addPet({
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        weight: 1,
        age: Number(petData.age) * 12,
        activityLevel: 'moderate',
        feedingGoal: 'maintenance',
        isNeutered: petData.isNeutered,
        neuteredDate: petData.isNeutered ? petData.neuteredDate : undefined,
      });
      toast.success(`${petData.name} adicionado com sucesso!`);
      setStep('feeder');
    } catch (error: any) {
      toast.error(error.message || 'Nao foi possivel adicionar o pet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipFeeder = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Marcar onboarding como completo
    const onboarding = JSON.parse(localStorage.getItem('onboarding') || '{}');
    localStorage.setItem('onboarding', JSON.stringify({ ...onboarding, completed: true }));
    
    toast.success('Bem-vindo ao SmartBite!');
    onComplete();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {step === 'welcome' && (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <img src="/logos/smartbite-logo.png" alt="SmartBite" className="h-20 w-auto" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Bem-vindo ao SmartBite!</CardTitle>
              <CardDescription className="text-base">
                Vamos preparar sua experiência de alimentação inteligente em 3 passos fáceis.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Cadastre seu pet</p>
                  <p className="text-sm text-muted-foreground">Adicione informações básicas</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Configure o alimentador</p>
                  <p className="text-sm text-muted-foreground">Conecte via Wi-Fi</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Comece!</p>
                  <p className="text-sm text-muted-foreground">Acesse seu dashboard</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              onClick={() => setStep('pet')}
              size="lg"
            >
              Começar <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSkipFeeder}
            >
              Pular por enquanto
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'pet' && (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Cadastre seu primeiro pet</CardTitle>
            <CardDescription>Vamos conhecer seu companheiro</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pet-name">Nome do Pet</Label>
              <Input
                id="pet-name"
                placeholder="Ex: Max, Luna, Doggo"
                value={petData.name}
                onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-species">Tipo</Label>
              <Select value={petData.species} onValueChange={(value: Species) => setPetData({ ...petData, species: value })}>
                <SelectTrigger id="pet-species" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Cachorro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-breed">Raça</Label>
              <Input
                id="pet-breed"
                placeholder="Ex: Golden Retriever, Siamês"
                value={petData.breed}
                onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-age">Idade (anos)</Label>
              <Input
                id="pet-age"
                type="number"
                placeholder="2"
                value={petData.age}
                onChange={(e) => setPetData({ ...petData, age: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Castrado/Esterilizado?</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!petData.isNeutered}
                    onChange={() => setPetData({ ...petData, isNeutered: false, neuteredDate: '' })}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Não</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={petData.isNeutered}
                    onChange={() => setPetData({ ...petData, isNeutered: true })}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Sim</span>
                </label>
              </div>
            </div>

            {petData.isNeutered && (
              <div className="space-y-2">
                <Label htmlFor="pet-neutered-date">Data de Castração</Label>
                <Input
                  id="pet-neutered-date"
                  type="date"
                  value={petData.neuteredDate}
                  onChange={(e) => setPetData({ ...petData, neuteredDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep('welcome')}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleAddPet}
                disabled={isLoading}
              >
                {isLoading ? 'Adicionando...' : 'Próximo'} <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'feeder' && (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Configure o Alimentador</CardTitle>
            <CardDescription>Conecte seu alimentador inteligente</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Alimentador Wi-Fi</p>
                <p className="text-xs text-muted-foreground">
                  Siga as instruções na tela de pareamento
                </p>
              </div>
            </div>

            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                <span className="text-muted-foreground">Pressione o botão de pareamento no alimentador</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                <span className="text-muted-foreground">Selecione sua rede Wi-Fi</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                <span className="text-muted-foreground">Digite a senha</span>
              </li>
            </ol>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep('pet')}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSkipFeeder}
                disabled={isLoading}
              >
                {isLoading ? 'Finalizando...' : 'Concluir Onboarding'}
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-xs"
              onClick={handleSkipFeeder}
              disabled={isLoading}
            >
              Conectar mais tarde
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
