import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Edit2, Trash2, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { Pet } from '@/lib/types';
import { api } from '@/lib/api';

interface PetProfileProps {
  pet: Pet;
  onBack: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const PetProfile = ({ pet, onBack, onUpdate, onDelete }: PetProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // Garantir que age é sempre um número
  const [editData, setEditData] = useState({ ...pet, age: Number(pet.age) || 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set(['Manhã', 'Noite']));
  const [dailyGrams, setDailyGrams] = useState(pet.dailyRecommendedGrams?.toString() || '200');
  
  // Converter meses para anos e meses para exibição (garantir valores numéricos)
  const ageNum = Number(editData.age) || 0;
  const ageYears = Math.floor(ageNum / 12);
  const ageMonthsOnly = ageNum % 12;

  const handleSave = async () => {
    if (!editData.name || !editData.weight) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    await api.updatePet(pet.id, editData);

    if (onUpdate) {
      onUpdate();
    }
    toast.success('Pet atualizado com sucesso!');
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja deletar ${pet.name}? Esta ação não pode ser desfeita.`)) return;

    setIsLoading(true);
    try {
      await api.deletePet(pet.id);
      toast.success(`${pet.name} foi removido com sucesso!`);
      
      if (onDelete) {
        onDelete();
      }
      // Pequeno delay para ver a notificação antes de voltar
      await new Promise(resolve => setTimeout(resolve, 300));
      onBack();
    } catch (error) {
      toast.error(`Erro ao remover ${pet.name}`);
      setIsLoading(false);
    }
  };

  const handleSaveMealPlan = async () => {
    if (!dailyGrams || selectedMeals.size === 0) {
      toast.error('Por favor, selecione pelo menos um horário e defina a quantidade');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast.success(`Plano alimentar salvo: ${Array.from(selectedMeals).join(', ')} - ${dailyGrams}g`);
    setIsLoading(false);
  };

  const toggleMealTime = (time: string) => {
    const newMeals = new Set(selectedMeals);
    if (newMeals.has(time)) {
      newMeals.delete(time);
    } else {
      newMeals.add(time);
    }
    setSelectedMeals(newMeals);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="diet">Dieta</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    value={editData.weight || ''}
                    onChange={(e) => setEditData({ ...editData, weight: parseFloat(e.target.value) })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idade (anos)</Label>
                  <Input
                    type="number"
                    value={ageYears}
                    onChange={(e) => {
                      const newYears = parseInt(e.target.value) || 0;
                      setEditData({ ...editData, age: newYears * 12 + ageMonthsOnly });
                    }}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meses (adicional)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={11}
                    value={ageMonthsOnly}
                    onChange={(e) => {
                      const newMonths = Math.min(11, parseInt(e.target.value) || 0);
                      setEditData({ ...editData, age: ageYears * 12 + newMonths });
                    }}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Total: {editData.age} meses ({ageYears}a {ageMonthsOnly}m)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Raça</Label>
                  <Input
                    value={editData.breed || ''}
                    onChange={(e) => setEditData({ ...editData, breed: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Castração/Esterilização</Label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!editData.isNeutered}
                        onChange={() => setEditData({ ...editData, isNeutered: false })}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Não castrado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={editData.isNeutered}
                        onChange={() => setEditData({ ...editData, isNeutered: true })}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Castrado</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Condição Corporal</Label>
                  <select
                    value={editData.bodyCondition || 'ideal'}
                    onChange={(e) => setEditData({ ...editData, bodyCondition: e.target.value as any })}
                    disabled={isLoading}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <option value="underweight">Abaixo do peso</option>
                    <option value="ideal">Peso ideal</option>
                    <option value="overweight">Sobrepeso</option>
                    <option value="obese">Obeso</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(pet);
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{pet.name}</CardTitle>
                  <CardDescription>
                    {pet.species} • {ageYears} anos {ageMonthsOnly > 0 ? `e ${ageMonthsOnly} meses` : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Peso</p>
                      <p className="text-lg font-semibold">{pet.weight || '—'} kg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Cadastrado em</p>
                      <p className="text-sm font-semibold">{pet.createdAt ? new Date(pet.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Progresso da Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Alimentações hoje</span>
                      <span className="font-semibold">2/3</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Consumo da semana</span>
                      <span className="font-semibold">680g / 700g</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '97%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Diet Tab */}
        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano Alimentar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Tipo de Ração</Label>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-foreground font-medium">Nao configurado</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantidade diária (gramas)</Label>
                <Input
                  type="number"
                  placeholder="200"
                  value={dailyGrams}
                  onChange={(e) => setDailyGrams(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Frequência de alimentação</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Manhã', 'Tarde', 'Noite'].map(time => (
                    <button 
                      key={time} 
                      onClick={() => toggleMealTime(time)}
                      disabled={isLoading}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedMeals.has(time)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-secondary bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleSaveMealPlan}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Plano Alimentar'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Últimas Alimentações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { time: '08:00', amount: '150g', status: 'completo' },
                { time: '12:30', amount: '150g', status: 'completo' },
                { time: 'Aguardando próxima...', amount: '150g', status: 'pendente' },
              ].map((record, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{record.time}</p>
                    <p className="text-xs text-muted-foreground">{record.amount}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    record.status === 'completo' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {record.status === 'completo' ? '✓ Completo' : 'Pendente'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar {pet.name}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
