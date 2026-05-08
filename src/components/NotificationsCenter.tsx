import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trash2, Check, X, AlertCircle, Info, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsCenterProps {
  onBack: () => void;
  onGoToSettings?: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Alimentador Desconectado',
    message: 'Seu alimentador perdeu a conexão Wi-Fi',
    timestamp: '2024-05-07T10:30:00',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Bateria Baixa',
    message: 'Bateria do alimentador em 15%',
    timestamp: '2024-05-07T09:15:00',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Alimentação Completa',
    message: 'Max recebeu sua refeição de 150g',
    timestamp: '2024-05-07T08:00:00',
    read: true,
  },
];

export const NotificationsCenter = ({ onBack, onGoToSettings }: NotificationsCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('unread');

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (activeTab === 'unread') {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } else {
      setNotifications(notifications.filter(n => !n.read));
    }
  };

  const renderNotification = (notification: Notification, index: number) => {
    const bgColor = {
      alert: 'bg-red-100/20 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      warning: 'bg-yellow-100/20 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      info: 'bg-blue-100/20 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    };

    const textColor = {
      alert: 'text-red-700 dark:text-red-400',
      warning: 'text-yellow-700 dark:text-yellow-400',
      info: 'text-blue-700 dark:text-blue-400',
    };

    const Icon = {
      alert: AlertCircle,
      warning: AlertCircle,
      info: Info,
    }[notification.type];

    return (
      <div
        key={index}
        className={`p-4 rounded-lg border-2 ${bgColor[notification.type]} space-y-2`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-3 flex-1">
            <Icon className={`h-5 w-5 mt-0.5 ${textColor[notification.type]} flex-shrink-0`} />
            <div className="flex-1">
              <p className={`font-semibold ${textColor[notification.type]}`}>{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={() => deleteNotification(notification.id)}
            className={`${textColor[notification.type]} hover:opacity-70 transition-opacity`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!notification.read && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => markAsRead(notification.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Marcar como lido
          </Button>
        )}
      </div>
    );
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
        <h1 className="text-lg font-bold">Notificações</h1>
        {onGoToSettings && (
          <button
            onClick={onGoToSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Configurações de notificações"
          >
            <Settings className="h-5 w-5" />
          </button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">
            Não Lidas {unread.length > 0 && <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">{unread.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="read">Lidas</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3 mt-4">
          {unread.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Sem notificações não lidas</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {unread.map((notif, idx) => renderNotification(notif, idx))}
              <Button variant="outline" className="w-full" onClick={clearAll}>
                Marcar todas como lidas
              </Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3 mt-4">
          {read.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Nenhuma notificação lida</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {read.map((notif, idx) => renderNotification(notif, idx))}
              <Button 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar todas
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
