import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Mail, Smartphone } from 'lucide-react';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  criticalAlerts: boolean;
  warnings: boolean;
  infoMessages: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
}

interface NotificationSettingsProps {
  onBack: () => void;
}

export const NotificationSettings = ({ onBack }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: false,
    criticalAlerts: true,
    warnings: true,
    infoMessages: true,
    frequency: 'realtime',
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleFrequencyChange = (value: string) => {
    setSettings({
      ...settings,
      frequency: value as NotificationSettings['frequency'],
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>
      </div>

      {/* Channel Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Canais de Notificação</CardTitle>
          <CardDescription>Escolha como receber alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Notificações Push</p>
                <p className="text-xs text-muted-foreground">Alertas em tempo real no app</p>
              </div>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={() => handleToggle('pushEnabled')}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Notificações por Email</p>
                <p className="text-xs text-muted-foreground">Resumo diário de alertas</p>
              </div>
            </div>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={() => handleToggle('emailEnabled')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tipos de Alerta</CardTitle>
          <CardDescription>Quais notificações você quer receber</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Critical Alerts */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-100/10 dark:bg-red-900/10">
            <div>
              <p className="font-medium text-foreground">Alertas Críticos</p>
              <p className="text-xs text-muted-foreground">Alimentador offline, erro crítico</p>
            </div>
            <Switch
              checked={settings.criticalAlerts}
              onCheckedChange={() => handleToggle('criticalAlerts')}
            />
          </div>

          {/* Warnings */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-100/10 dark:bg-yellow-900/10">
            <div>
              <p className="font-medium text-foreground">Avisos</p>
              <p className="text-xs text-muted-foreground">Bateria baixa, ração quase acabando</p>
            </div>
            <Switch
              checked={settings.warnings}
              onCheckedChange={() => handleToggle('warnings')}
            />
          </div>

          {/* Info Messages */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-100/10 dark:bg-blue-900/10">
            <div>
              <p className="font-medium text-foreground">Mensagens Informativas</p>
              <p className="text-xs text-muted-foreground">Alimentação completada, atualizações</p>
            </div>
            <Switch
              checked={settings.infoMessages}
              onCheckedChange={() => handleToggle('infoMessages')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequência de Notificações</CardTitle>
          <CardDescription>Com qual frequência receber resumos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={settings.frequency} onValueChange={handleFrequencyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Em Tempo Real</SelectItem>
              <SelectItem value="hourly">A Cada Hora</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            {settings.frequency === 'realtime' && 'Você receberá notificações instantaneamente assim que ocorrerem.'}
            {settings.frequency === 'hourly' && 'Notificações serão agrupadas e enviadas a cada hora.'}
            {settings.frequency === 'daily' && 'Um resumo diário será enviado de manhã.'}
          </p>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Horas Silenciosas</CardTitle>
          <CardDescription>Não receber notificações neste período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <p className="font-medium text-foreground">Ativar Horas Silenciosas</p>
              <p className="text-xs text-muted-foreground">22:00 às 08:00</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Descartar
        </Button>
        <Button className="flex-1">Salvar Preferências</Button>
      </div>
    </div>
  );
};
