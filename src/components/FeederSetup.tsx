import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wifi, WifiOff, RotateCw, Zap } from 'lucide-react';
import { api } from '@/lib/api';

interface FeederSetupProps {
  onBack: () => void;
}

export const FeederSetup = ({ onBack }: FeederSetupProps) => {
  const [step, setStep] = useState<'select' | 'pairing' | 'success'>('select');
  const [networkName, setNetworkName] = useState('');
  const [networkPassword, setNetworkPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartPairing = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep('pairing');
    setIsLoading(false);
  };

  const handleConnect = async () => {
    if (!networkName || !networkPassword) {
      toast.error('Por favor, preencha a rede e senha');
      return;
    }

    setIsLoading(true);
    try {
      await api.setupFeeder(`SMARTBITE-${networkName.replace(/\W/g, '').toUpperCase() || 'WIFI'}`, 'Comedouro SmartBite');
      toast.success('Alimentador conectado com sucesso!');
      setStep('success');
    } catch (error: any) {
      toast.error(error.message || 'Nao foi possivel conectar o alimentador');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'select' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Conectar Novo Alimentador</CardTitle>
              <CardDescription>Escolha o tipo de aparelho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-4 rounded-lg border-2 border-primary text-left hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">SmartBite Wi-Fi</p>
                    <p className="text-sm text-muted-foreground">Alimentador inteligente com Wi-Fi</p>
                  </div>
                  <Wifi className="h-5 w-5 text-primary" />
                </div>
              </button>

              <button className="w-full p-4 rounded-lg border-2 border-muted text-left hover:bg-secondary/50 transition-colors opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">SmartBite Bluetooth</p>
                    <p className="text-sm text-muted-foreground">Em breve...</p>
                  </div>
                  <WifiOff className="h-5 w-5 text-muted" />
                </div>
              </button>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleStartPairing} className="flex-1">
                  Prosseguir
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'pairing' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Modo de Pareamento</CardTitle>
              <CardDescription>O alimentador está aguardando conexão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 space-y-3 text-center">
                <div className="animate-pulse">
                  <Wifi className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Procurando rede...</p>
                </div>
              </div>

              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span className="text-muted-foreground">Botão de pareamento pressionado</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">✓</span>
                  <span className="text-muted-foreground">LED azul piscando</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">→</span>
                  <span className="text-muted-foreground">Aguardando seleção de rede...</span>
                </li>
              </ol>

              <div className="space-y-3 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Rede Wi-Fi</Label>
                  <Input
                    placeholder="Nome da rede (SSID)"
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha Wi-Fi</Label>
                  <Input
                    type="password"
                    placeholder="Senha da rede"
                    value={networkPassword}
                    onChange={(e) => setNetworkPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('select')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Conectando...' : 'Conectar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'success' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Conectado com Sucesso! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-green-100/20 dark:bg-green-900/20 space-y-2">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Wifi className="h-5 w-5" />
                  <p className="font-semibold">SmartBite Wi-Fi - Conectado</p>
                </div>
                <p className="text-sm text-muted-foreground ml-7">Rede: {networkName}</p>
                <p className="text-sm text-muted-foreground ml-7">Firmware: v2.1.4</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-green-600">Online</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Bateria</p>
                  <p className="text-sm font-semibold">98%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Sinal</p>
                  <p className="text-sm font-semibold">Forte (-35dBm)</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Versão</p>
                  <p className="text-sm font-semibold">v2.1.4</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button className="w-full justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  Ir para Configurações
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onBack}
                >
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
