import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { X, Plus, Clock, Repeat } from 'lucide-react';

interface Schedule {
  id: string;
  time: string;
  amount: number;
  days: string[];
  enabled: boolean;
}

interface ScheduleFormProps {
  onClose: () => void;
  onSave?: (schedule: Schedule) => void;
  initialData?: Schedule;
}

export const ScheduleForm = ({ onClose, onSave, initialData }: ScheduleFormProps) => {
  const [time, setTime] = useState(initialData?.time || '08:00');
  const [amount, setAmount] = useState(initialData?.amount || 150);
  const [selectedDays, setSelectedDays] = useState<string[]>(initialData?.days || ['Monday', 'Wednesday', 'Friday']);
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { key: 'Monday', label: 'Seg' },
    { key: 'Tuesday', label: 'Ter' },
    { key: 'Wednesday', label: 'Qua' },
    { key: 'Thursday', label: 'Qui' },
    { key: 'Friday', label: 'Sex' },
    { key: 'Saturday', label: 'Sab' },
    { key: 'Sunday', label: 'Dom' },
  ];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = async () => {
    if (!time || amount <= 0 || selectedDays.length === 0) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const schedule: Schedule = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      time,
      amount: parseInt(amount.toString()),
      days: selectedDays,
      enabled: true,
    };

    if (onSave) {
      onSave(schedule);
    }
    toast.success('Agendamento salvo com sucesso!');
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Novo Agendamento</CardTitle>
            <CardDescription>Configure alimentação automática</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Time Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário
            </Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Quantidade (gramas)</Label>
            <Input
              type="number"
              min="10"
              max="500"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>

          {/* Days Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Repetir em
            </Label>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => (
                <button
                  key={day.key}
                  onClick={() => toggleDay(day.key)}
                  disabled={isLoading}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedDays.includes(day.key)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/70'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-secondary/50 space-y-1">
            <p className="text-xs text-muted-foreground">Próxima alimentação</p>
            <p className="font-semibold text-foreground">{time} - {amount}g</p>
            <p className="text-xs text-muted-foreground">
              {selectedDays.length === 7 ? 'Todos os dias' : `${selectedDays.length}x por semana`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
