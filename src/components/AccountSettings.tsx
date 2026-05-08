import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Mail, Lock, Trash2, Edit2, Eye, EyeOff, AlertTriangle, ArrowLeft, Moon, Globe, Weight, Bell } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AccountSettingsProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  onGoBack: () => void;
}

export const AccountSettings = ({ user, onLogout, onUserUpdate, onGoBack }: AccountSettingsProps) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email state
  const [newEmail, setNewEmail] = useState(user?.email ?? '');

  useEffect(() => {
    setNewEmail(user?.email ?? '');
  }, [user]);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('pt-BR');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [offlineAlerts, setOfflineAlerts] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleEmailUpdate = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast.error('Email não pode ser vazio ou igual ao atual');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error('Email inválido');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user, email: newEmail };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUserUpdate(updatedUser);
    toast.success('Email atualizado com sucesso!');
    setEditingEmail(false);
    setIsLoading(false);
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('A nova senha não pode ser igual à atual');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success('Senha alterada com sucesso!');
    setEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.removeItem('user');
    toast.success('Conta deletada com sucesso!');
    onLogout();
    setIsLoading(false);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const preferences = { theme, language, weightUnit, offlineAlerts };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    toast.success('Preferências salvas com sucesso!');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onGoBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Minha Conta</CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Nome</Label>
            <div className="p-3 rounded-lg bg-secondary/50 text-foreground font-medium">
              {user?.name ?? ''}
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Email</Label>
            {editingEmail ? (
              <div className="space-y-2">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="novo@email.com"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEmailUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingEmail(false);
                      setNewEmail(user?.email ?? '');
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-foreground">{user?.email ?? ''}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingEmail(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-muted-foreground text-xs">Senha</Label>
            {editingPassword ? (
              <div className="space-y-3">
                {/* Current Password */}
                <div className="relative">
                  <Label htmlFor="current-password" className="text-xs">Senha Atual</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      disabled={isLoading}
                      placeholder="••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <Label htmlFor="new-password" className="text-xs">Nova Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      disabled={isLoading}
                      placeholder="••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Label htmlFor="confirm-password" className="text-xs">Confirmar Nova Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      placeholder="••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Senha'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingPassword(true)}
                className="w-full justify-start"
              >
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Personalize sua experiência no SmartBite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Moon className="h-4 w-4" />
              Tema
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                disabled={isLoading}
              >
                Claro
              </Button>
              <Button
                size="sm"
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                disabled={isLoading}
              >
                Escuro
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Idioma
            </Label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español (España)</option>
            </select>
          </div>

          {/* Weight Unit */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="flex items-center gap-2 text-base">
              <Weight className="h-4 w-4" />
              Unidade de Peso
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={weightUnit === 'kg' ? 'default' : 'outline'}
                onClick={() => setWeightUnit('kg')}
                disabled={isLoading}
              >
                Quilogramas (kg)
              </Button>
              <Button
                size="sm"
                variant={weightUnit === 'lb' ? 'default' : 'outline'}
                onClick={() => setWeightUnit('lb')}
                disabled={isLoading}
              >
                Libras (lb)
              </Button>
            </div>
          </div>

          {/* Offline Alerts */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Alertas de Dispositivo Offline
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offline-alerts"
                checked={offlineAlerts}
                onChange={(e) => setOfflineAlerts(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="offline-alerts" className="text-sm text-muted-foreground cursor-pointer">
                Receber notificações quando um comedouro ficar offline
              </label>
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={handleSavePreferences}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </CardContent>
      </Card>

      {/* Help & Legal */}
      <Card>
        <CardHeader>
          <CardTitle>Ajuda & Legal</CardTitle>
          <CardDescription>Informações importantes sobre o SmartBite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowPrivacy(true)}
          >
            Política de Privacidade
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowTerms(true)}
          >
            Termos de Serviço
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            Tutorial: Como Adicionar Raça do Pet
          </Button>
        </CardContent>
      </Card>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações que não podem ser desfeitas</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar Conta
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Deletar Conta
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita e você perderá todos os seus dados.
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Todos os seus pets e histórico de alimentação serão perdidos permanentemente.
            </AlertDescription>
          </Alert>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? 'Deletando...' : 'Deletar Conta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Coleta de Dados</h4>
              <p>Coletamos informações básicas de perfil (nome, email) e dados dos seus pets para fornecer nossos serviços.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Uso de Dados</h4>
              <p>Seus dados são utilizados apenas para melhorar nossos serviços e fornecer uma melhor experiência.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Segurança</h4>
              <p>Implementamos medidas de segurança para proteger seus dados contra acesso não autorizado.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Compartilhamento</h4>
              <p>Não compartilhamos seus dados com terceiros sem seu consentimento expresso.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Contato</h4>
              <p>Para dúvidas sobre privacidade, entre em contato conosco via email: privacy@smartbite.com.br</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacy(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termos de Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Aceitação dos Termos</h4>
              <p>Ao usar o SmartBite, você concorda com estes termos e condições.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Uso Responsável</h4>
              <p>Você concorda em usar o serviço de forma responsável e em conformidade com todas as leis aplicáveis.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Responsabilidade</h4>
              <p>SmartBite não é responsável por dados perdidos ou acesso não autorizado devido a negligência do usuário.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Modificações</h4>
              <p>Reservamos o direito de modificar estes termos a qualquer momento, com notificação prévia.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Encerramento</h4>
              <p>Podemos encerrar sua conta se violar estes termos ou por qualquer motivo legítimo.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTerms(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
