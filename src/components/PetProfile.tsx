import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ArrowLeft, Edit2, Trash2, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  weight?: number;
  diet?: string;
  createdAt: string;
}

interface PetProfileProps {
  pet: Pet;
  onBack: () => void;
  onUpdate?: (pet: Pet) => void;
  onDelete?: (id: string) => void;
}

export const PetProfile = ({ pet, onBack, onUpdate, onDelete }: PetProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(pet);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editData.name || !editData.weight) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onUpdate) {
      onUpdate(editData);
    }
    toast.success('Pet atualizado com sucesso!');
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja deletar ${pet.name}?`)) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onDelete) {
      onDelete(pet.id);
    }
    toast.success(`${pet.name} removido!`);
    setIsLoading(false);
    onBack();
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
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: parseInt(e.target.value) })}
                    disabled={isLoading}
                  />
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
                    {pet.species} • {pet.age} anos
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
                      <p className="text-sm font-semibold">{new Date(pet.createdAt).toLocaleDateString('pt-BR')}</p>
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
                  <p className="text-foreground font-medium">{editData.diet || 'Não configurado'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantidade diária (gramas)</Label>
                <Input
                  type="number"
                  placeholder="200"
                  defaultValue="200"
                />
              </div>

              <div className="space-y-2">
                <Label>Frequência de alimentação</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Manhã', 'Tarde', 'Noite'].map(time => (
                    <button key={time} className="p-2 rounded-lg border-2 border-primary text-sm font-medium">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full">Salvar Plano Alimentar</Button>
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
