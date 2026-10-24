import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { formatMoney, Product, PRODUCTS } from './src/data';

type Screen = 'splash' | 'login' | 'register' | 'chat' | 'history' | 'profile';
type Cart = Record<string, { product: Product; quantity: number }>;

const COLORS = {
  ink: '#0B5557',
  teal: '#08796F',
  tealDark: '#035E57',
  mint: '#C8F3EE',
  aqua: '#A5EEEE',
  gray: '#E9E9E9',
  muted: '#6B7779',
  white: '#FFFFFF',
  black: '#102022',
};

const botAvatar = require('./assets/laria/bot-avatar.png');
const robotMain = require('./assets/laria/robot-main.png');

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brand, compact && styles.brandCompact]}>
      {!compact && <Image source={robotMain} style={styles.brandRobot} resizeMode="contain" />}
      <View>
        <Text style={[styles.brandName, compact && styles.brandNameCompact]}>Lar<Text style={styles.brandAccent}>IA</Text></Text>
        <Text style={styles.brandTag}>Sua casa inteligente,{`\n`}planejada com você.</Text>
      </View>
    </View>
  );
}

function GeometricBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.diamond, { top: -105, left: -75, backgroundColor: COLORS.mint }]} />
      <View style={[styles.diamond, { top: 135, left: -150, backgroundColor: COLORS.aqua, opacity: 0.65 }]} />
      <View style={[styles.diamond, { bottom: -160, right: -145, backgroundColor: '#9EDDF4', opacity: 0.65 }]} />
    </View>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { icon?: string }) {
  return (
    <View style={styles.fieldWrap}>
      {!!props.icon && <Text style={styles.fieldIcon}>{props.icon}</Text>}
      <TextInput
        {...props}
        placeholderTextColor="#6EA9A4"
        style={[styles.field, props.icon ? styles.fieldWithIcon : null, props.style]}
      />
    </View>
  );
}

function PrimaryButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.primaryButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SplashScreen() {
  return (
    <SafeAreaView style={styles.authPage}>
      <GeometricBackground />
      <View style={styles.splashContent}>
        <Image source={robotMain} resizeMode="contain" style={styles.splashRobot} />
        <Brand compact />
      </View>
    </SafeAreaView>
  );
}

function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Complete os campos', 'Informe seu nome ou e-mail e sua senha.');
      return;
    }
    onLogin();
  };

  return (
    <KeyboardAvoidingView style={styles.authPage} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <GeometricBackground />
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <Brand />
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Login</Text>
          <Field accessibilityLabel="Nome ou e-mail" placeholder="Nome ou e-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <Field accessibilityLabel="Senha" placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          <PrimaryButton title="Acessar" onPress={submit} />
          <Pressable onPress={() => Alert.alert('Recuperar senha', 'Um link de recuperação será enviado quando o backend de autenticação estiver conectado.')}>
            <Text style={styles.link}>Esqueceu sua senha?</Text>
          </Pressable>
          <Pressable onPress={onRegister} style={styles.accountLink}>
            <Text style={styles.accountLinkText}>Ainda não tem conta? <Text style={styles.link}>Cadastrar</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RegisterScreen({ onDone, onLogin }: { onDone: () => void; onLogin: () => void }) {
  const [form, setForm] = useState({ name: '', cpf: '', email: '', password: '', repeat: '' });
  const [accepted, setAccepted] = useState(false);
  const update = (key: keyof typeof form) => (value: string) => setForm({ ...form, [key]: value });

  const submit = () => {
    if (Object.values(form).some((value) => !value.trim())) return Alert.alert('Cadastro incompleto', 'Preencha todos os campos.');
    if (form.password !== form.repeat) return Alert.alert('Senhas diferentes', 'Digite a mesma senha nos dois campos.');
    if (!accepted) return Alert.alert('Termos de uso', 'Aceite os termos para continuar.');
    Alert.alert('Cadastro concluído', 'Seu perfil de demonstração foi criado.');
    onDone();
  };

  return (
    <KeyboardAvoidingView style={styles.authPage} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <GeometricBackground />
      <ScrollView contentContainerStyle={styles.registerScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.registerHeading}>
          <Image source={botAvatar} style={styles.miniLogo} />
          <Text style={styles.registerTitle}>Cadastro de Usuário</Text>
        </View>
        <View style={styles.registerCard}>
          <Field icon="♙" placeholder="Nome completo" value={form.name} onChangeText={update('name')} />
          <Field icon="●" placeholder="CPF" keyboardType="numeric" value={form.cpf} onChangeText={update('cpf')} />
          <Field icon="✉" placeholder="Endereço eletrônico" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={update('email')} />
          <Field icon="▣" placeholder="Senha" secureTextEntry value={form.password} onChangeText={update('password')} />
          <Field icon="▣" placeholder="Repita a senha" secureTextEntry value={form.repeat} onChangeText={update('repeat')} />
          <Pressable style={styles.termsRow} onPress={() => setAccepted(!accepted)}>
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>{accepted && <Text style={styles.check}>✓</Text>}</View>
            <Text style={styles.termsText}>Concordo com os <Text style={styles.termsStrong}>Termos de Uso</Text> e <Text style={styles.termsStrong}>Política de Privacidade</Text></Text>
          </Pressable>
          <PrimaryButton title="Cadastrar" onPress={submit} />
          <Pressable onPress={onLogin}><Text style={styles.registerFooter}>Já tem uma conta? <Text style={styles.link}>Acessar</Text></Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <View style={styles.header}>
      <Image source={botAvatar} style={styles.headerBot} />
      <Brand compact />
      <Pressable accessibilityLabel="Abrir perfil" onPress={onProfile} style={styles.profileButton}><Text style={styles.profileIcon}>●</Text></Pressable>
    </View>
  );
}

function BotMessage({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.messageRow}>
      <Image source={botAvatar} style={styles.avatar} />
      <View style={styles.botBubble}>{typeof children === 'string' ? <Text style={styles.botText}>{children}</Text> : children}</View>
    </View>
  );
}

function UserChoice({ icon, title }: { icon: string; title: string }) {
  return <View style={styles.userChoice}><Text style={styles.userChoiceIcon}>{icon}</Text><Text style={styles.userChoiceText}>{title}</Text></View>;
}

function ProductCard({ product, added, onPress }: { product: Product; added: boolean; onPress: () => void }) {
  return (
    <View style={styles.productCard}>
      <Image source={product.image as ImageSourcePropType} style={styles.productImage} resizeMode="contain" />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{formatMoney(product.price)}</Text>
      <Pressable onPress={onPress} style={[styles.smallButton, added && styles.addedButton]}>
        <Text style={styles.smallButtonText}>{added ? '✓ Adicionado' : '+ Adicionar'}</Text>
      </Pressable>
    </View>
  );
}

function ProductModal({ product, visible, onClose, onAdd }: { product: Product | null; visible: boolean; onClose: () => void; onAdd: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('#FFFFFF');
  useEffect(() => { if (visible) { setQuantity(1); setColor('#FFFFFF'); } }, [visible]);
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <ScrollView contentContainerStyle={styles.modalScroll}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Pressable onPress={onClose}><Text style={styles.modalClose}>fechar</Text></Pressable>
              <Text style={styles.modalTitle}>Adicionar Dispositivo</Text>
            </View>
            <Image source={product.image as ImageSourcePropType} style={styles.modalImage} resizeMode="contain" />
            <Text style={styles.modalProductTitle}>{product.name} - {product.model}</Text>
            <Text style={styles.modalDescription}>{product.description}</Text>
            <Text style={styles.estimated}>Preço Estimado: <Text style={styles.estimatedValue}>{formatMoney(product.price)}</Text></Text>
            <Text style={styles.controlLabel}>Quantidade</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.stepButton}><Text style={styles.stepText}>−</Text></Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
              <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.stepButton}><Text style={styles.stepText}>+</Text></Pressable>
            </View>
            {!!product.colors?.length && (
              <View style={styles.colorRow}>
                <Text style={styles.controlLabel}>Cor da luz</Text>
                <View style={styles.swatches}>{product.colors.map((item) => <Pressable key={item} onPress={() => setColor(item)} style={[styles.swatch, { backgroundColor: item }, color === item && styles.swatchSelected]} />)}</View>
              </View>
            )}
            <PrimaryButton title={`Adicionar • ${formatMoney(product.price * quantity)}`} onPress={() => onAdd(product, quantity)} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function BottomNav({ active, onNavigate }: { active: 'chat' | 'history'; onNavigate: (screen: 'chat' | 'history') => void }) {
  return (
    <View style={styles.bottomNav}>
      <Pressable onPress={() => onNavigate('chat')} style={styles.navItem}><Text style={[styles.navIcon, active === 'chat' && styles.navActive]}>⌂</Text><Text style={[styles.navLabel, active === 'chat' && styles.navActive]}>Home</Text></Pressable>
      <Pressable onPress={() => onNavigate('history')} style={styles.navItem}><Text style={[styles.navIcon, active === 'history' && styles.navActive]}>◷</Text><Text style={[styles.navLabel, active === 'history' && styles.navActive]}>Histórico</Text></Pressable>
    </View>
  );
}

function Composer({ onAttach }: { onAttach: () => void }) {
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    Alert.alert('Mensagem enviada', 'No modo de demonstração, a LarIA responderá pelos fluxos já preparados.');
    setText('');
  };
  return (
    <View style={styles.composer}>
      <Pressable onPress={onAttach} accessibilityLabel="Adicionar arquivo" style={styles.attach}><Text style={styles.attachText}>＋</Text></Pressable>
      <TextInput style={styles.composerInput} placeholder="Digite aqui..." placeholderTextColor={COLORS.ink} value={text} onChangeText={setText} onSubmitEditing={send} />
      <Pressable onPress={send} accessibilityLabel="Enviar mensagem"><Text style={styles.send}>➤</Text></Pressable>
    </View>
  );
}

function ChatScreen({ onProfile, onHistory }: { onProfile: () => void; onHistory: () => void }) {
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const recommendations = [PRODUCTS[3], PRODUCTS[1], PRODUCTS[2]];
  const total = useMemo(() => Object.values(cart).reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const analyze = (source: string) => {
    setAttachmentOpen(false);
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); Alert.alert('Arquivo recebido', `${source} anexado com sucesso.`); }, 900);
  };
  const add = (product: Product, quantity: number) => {
    setCart((current) => ({ ...current, [product.id]: { product, quantity } }));
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.appPage}>
      <GeometricBackground />
      <Header onProfile={onProfile} />
      <View style={styles.chatPanel}>
        <ScrollView contentContainerStyle={styles.chatContent}>
          <BotMessage>Olá! Eu sou a LarIA 🏡✨{`\n`}Estou aqui para simplificar o planejamento da sua casa inteligente.{`\n`}Para começarmos, envie uma imagem ou PDF da sua planta no ícone de + abaixo.</BotMessage>
          {attachmentOpen && (
            <View style={styles.attachMenu}>
              <Pressable onPress={() => analyze('Documento ou PDF')}><Text style={styles.attachOption}>▱  Enviar Documento ou PDF</Text></Pressable>
              <Pressable onPress={() => analyze('Imagem da galeria')}><Text style={styles.attachOption}>▧  Escolher da Galeria</Text></Pressable>
              <Pressable onPress={() => analyze('Foto da planta')}><Text style={styles.attachOption}>▣  Tirar Foto da Planta</Text></Pressable>
              <Pressable onPress={() => setAttachmentOpen(false)}><Text style={styles.cancel}>Cancelar</Text></Pressable>
            </View>
          )}
          {loading && <BotMessage><Text style={styles.botText}><Text style={styles.bold}>Planta recebida!</Text>{`\n`}Analisando a estrutura e identificando os cômodos... 🤔{`\n`}Aguarde um momento...</Text></BotMessage>}
          {step >= 1 && (
            <>
              <BotMessage>Análise concluída! 🌴{`\n`}Identifiquei 3 cômodos principais:</BotMessage>
              <BotMessage><Text style={styles.botText}>▣  Sala de Estar{`\n\n`}▤  Cozinha{`\n\n`}▰  Quarto Principal</Text></BotMessage>
              <BotMessage>Sobre qual deles você gostaria de falar primeiro? Ou prefere ver uma sugestão geral?</BotMessage>
              <Pressable onPress={() => setStep(2)}><UserChoice icon="▰" title="Quarto Principal" /></Pressable>
            </>
          )}
          {step >= 2 && (
            <>
              <BotMessage>Ótima escolha! Vamos focar no Quarto Principal 🛏️. Com base no tamanho, aqui estão os dispositivos mais indicados para começar:</BotMessage>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsRow}>
                {recommendations.map((product) => <ProductCard key={product.id} product={product} added={!!cart[product.id]} onPress={() => setSelected(product)} />)}
              </ScrollView>
            </>
          )}
          {total > 0 && (
            <>
              <BotMessage><Text style={styles.botText}>Perfeito! Adicionei os dispositivos selecionados ao seu <Text style={styles.bold}>Quarto Principal.</Text></Text></BotMessage>
              <BotMessage>
                <View>
                  <Text style={styles.summaryTitle}>Resumo do Orçamento Atual</Text>
                  {Object.values(cart).map(({ product, quantity }) => <Text key={product.id} style={styles.summaryLine}>{quantity}x {product.name}: {formatMoney(product.price * quantity)}</Text>)}
                  <Text style={styles.summaryTotal}>Total Parcial: {formatMoney(total)}</Text>
                </View>
              </BotMessage>
              <BotMessage>Deseja configurar outro cômodo ou finalizar?</BotMessage>
              <View style={styles.finishRow}>
                <Pressable style={styles.secondaryButton} onPress={() => setStep(1)}><Text style={styles.secondaryText}>Outro cômodo</Text></Pressable>
                <Pressable style={styles.primaryMini} onPress={() => Alert.alert('Orçamento salvo', 'Seu orçamento foi adicionado ao histórico.')}><Text style={styles.primaryMiniText}>Finalizar</Text></Pressable>
              </View>
            </>
          )}
        </ScrollView>
        <Composer onAttach={() => setAttachmentOpen(!attachmentOpen)} />
        <BottomNav active="chat" onNavigate={(target) => target === 'history' && onHistory()} />
      </View>
      <ProductModal product={selected} visible={!!selected} onClose={() => setSelected(null)} onAdd={add} />
    </SafeAreaView>
  );
}

function HistoryScreen({ onHome, onProfile }: { onHome: () => void; onProfile: () => void }) {
  return (
    <SafeAreaView style={styles.appPage}>
      <GeometricBackground />
      <Header onProfile={onProfile} />
      <View style={styles.chatPanel}>
        <ScrollView contentContainerStyle={styles.historyContent}>
          <Text style={styles.pageTitle}>Histórico de projetos</Text>
          <View style={styles.historyCard}><View><Text style={styles.historyTitle}>Casa • Quarto Principal</Text><Text style={styles.historyMeta}>3 dispositivos • Hoje</Text></View><Text style={styles.historyValue}>R$ 1.435,00</Text></View>
          <View style={styles.historyCard}><View><Text style={styles.historyTitle}>Apartamento • Sala</Text><Text style={styles.historyMeta}>4 dispositivos • 18 out.</Text></View><Text style={styles.historyValue}>R$ 2.180,00</Text></View>
          <View style={styles.emptyHint}><Image source={botAvatar} style={styles.historyBot} /><Text style={styles.emptyText}>Seus próximos planejamentos aparecerão aqui. Você poderá reabrir, revisar e exportar cada orçamento.</Text></View>
        </ScrollView>
        <BottomNav active="history" onNavigate={(target) => target === 'chat' && onHome()} />
      </View>
    </SafeAreaView>
  );
}

function ProfileScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  return (
    <SafeAreaView style={styles.appPage}>
      <GeometricBackground />
      <View style={styles.profilePage}>
        <Pressable onPress={onBack}><Text style={styles.back}>‹ Voltar</Text></Pressable>
        <Image source={botAvatar} style={styles.profileAvatar} />
        <Text style={styles.pageTitle}>Meu perfil</Text>
        <View style={styles.profileCard}><Text style={styles.profileLabel}>Nome</Text><Text style={styles.profileValue}>Usuário LarIA</Text><Text style={styles.profileLabel}>E-mail</Text><Text style={styles.profileValue}>usuario@laria.app</Text><Text style={styles.profileLabel}>Integração</Text><Text style={styles.profileValue}>Modo demonstração • API pendente</Text></View>
        <PrimaryButton title="Sair da conta" onPress={onLogout} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [returnScreen, setReturnScreen] = useState<'chat' | 'history'>('chat');
  useEffect(() => { const timer = setTimeout(() => setScreen('login'), 1000); return () => clearTimeout(timer); }, []);
  const profile = (from: 'chat' | 'history') => { setReturnScreen(from); setScreen('profile'); };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {screen === 'splash' && <SplashScreen />}
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('chat')} onRegister={() => setScreen('register')} />}
      {screen === 'register' && <RegisterScreen onDone={() => setScreen('chat')} onLogin={() => setScreen('login')} />}
      {screen === 'chat' && <ChatScreen onProfile={() => profile('chat')} onHistory={() => setScreen('history')} />}
      {screen === 'history' && <HistoryScreen onHome={() => setScreen('chat')} onProfile={() => profile('history')} />}
      {screen === 'profile' && <ProfileScreen onBack={() => setScreen(returnScreen)} onLogout={() => setScreen('login')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#FAFEFD', overflow: 'hidden' },
  authPage: { flex: 1, backgroundColor: '#FAFEFD' },
  authScroll: { flexGrow: 1, justifyContent: 'flex-end', paddingTop: 44 },
  splashContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  splashRobot: { width: 250, height: 290 },
  diamond: { position: 'absolute', width: 300, height: 300, transform: [{ rotate: '45deg' }] },
  brand: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  brandCompact: { paddingHorizontal: 0 },
  brandRobot: { width: 170, height: 170, marginBottom: -28 },
  brandName: { fontSize: 70, lineHeight: 72, fontWeight: '900', color: '#073F43', letterSpacing: -4 },
  brandNameCompact: { fontSize: 48, lineHeight: 48 },
  brandAccent: { color: COLORS.teal },
  brandTag: { fontSize: 13, lineHeight: 16, textAlign: 'center', fontWeight: '800', color: '#073F43' },
  authCard: { marginTop: 28, backgroundColor: COLORS.teal, borderTopLeftRadius: 58, borderTopRightRadius: 58, paddingHorizontal: 34, paddingTop: 34, paddingBottom: 42, gap: 16 },
  authTitle: { textAlign: 'center', color: COLORS.white, fontSize: 25, fontWeight: '800', marginBottom: 4 },
  fieldWrap: { position: 'relative', justifyContent: 'center' },
  field: { backgroundColor: COLORS.white, borderRadius: 30, borderWidth: 2, borderColor: '#A5C7C5', color: COLORS.black, paddingHorizontal: 28, height: 58, fontSize: 18, fontWeight: '600' },
  fieldWithIcon: { paddingLeft: 54 },
  fieldIcon: { position: 'absolute', left: 24, zIndex: 2, fontSize: 18, color: COLORS.teal },
  primaryButton: { minHeight: 52, borderRadius: 28, backgroundColor: COLORS.tealDark, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white, marginTop: 4 },
  primaryButtonText: { color: COLORS.white, fontSize: 19, fontWeight: '800' },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  link: { color: COLORS.white, textDecorationLine: 'underline', textAlign: 'center', fontWeight: '800', fontSize: 15 },
  accountLink: { marginTop: 8 },
  accountLinkText: { color: COLORS.white, textAlign: 'center', fontSize: 15 },
  registerScroll: { flexGrow: 1, paddingTop: 52 },
  registerHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, marginBottom: 22 },
  miniLogo: { width: 65, height: 65, borderRadius: 16 },
  registerTitle: { color: '#294C4B', fontSize: 24, fontWeight: '800', flexShrink: 1 },
  registerCard: { backgroundColor: COLORS.teal, borderTopLeftRadius: 54, borderTopRightRadius: 54, paddingHorizontal: 34, paddingTop: 36, paddingBottom: 48, gap: 16 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: COLORS.white },
  check: { color: COLORS.teal, fontWeight: '900' },
  termsText: { color: COLORS.white, fontSize: 11, flex: 1 },
  termsStrong: { fontWeight: '900' },
  registerFooter: { color: COLORS.white, textAlign: 'center', fontSize: 16, marginTop: 10 },
  appPage: { flex: 1, backgroundColor: '#FBFEFD' },
  header: { height: 122, paddingHorizontal: 18, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBot: { width: 58, height: 58, borderRadius: 16 },
  profileButton: { width: 42, height: 42, borderWidth: 3, borderColor: COLORS.ink, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  profileIcon: { color: COLORS.ink, fontSize: 24, marginTop: -4 },
  chatPanel: { flex: 1, backgroundColor: '#E7E7E7', borderTopLeftRadius: 54, borderTopRightRadius: 54, overflow: 'hidden', paddingTop: 28 },
  chatContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 16 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  botBubble: { flex: 1, backgroundColor: COLORS.white, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 14, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  botText: { color: COLORS.ink, fontSize: 17, lineHeight: 23 },
  bold: { fontWeight: '900' },
  userChoice: { alignSelf: 'flex-end', width: '68%', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.teal, padding: 20, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, elevation: 5 },
  userChoiceIcon: { fontSize: 36, color: COLORS.white },
  userChoiceText: { color: COLORS.white, fontSize: 19, fontWeight: '800' },
  attachMenu: { width: 280, backgroundColor: COLORS.white, borderRadius: 18, padding: 18, gap: 18, marginLeft: 4 },
  attachOption: { color: COLORS.ink, fontSize: 15 },
  cancel: { color: COLORS.ink, fontWeight: '900', textAlign: 'center' },
  productsRow: { gap: 10, paddingVertical: 4 },
  productCard: { width: 132, backgroundColor: COLORS.white, borderRadius: 18, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 7, elevation: 4 },
  productImage: { width: 86, height: 86 },
  productName: { fontSize: 13, textAlign: 'center', minHeight: 34, color: COLORS.black },
  productPrice: { fontSize: 13, fontWeight: '900', marginBottom: 8 },
  smallButton: { backgroundColor: COLORS.tealDark, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 9 },
  addedButton: { backgroundColor: '#166C65' },
  smallButtonText: { color: COLORS.white, fontSize: 11 },
  summaryTitle: { color: COLORS.ink, fontSize: 17, fontWeight: '900', marginBottom: 12 },
  summaryLine: { color: COLORS.black, fontSize: 15, marginBottom: 4 },
  summaryTotal: { color: COLORS.ink, fontSize: 17, fontWeight: '900', marginTop: 8 },
  finishRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  secondaryButton: { borderWidth: 2, borderColor: COLORS.teal, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 22 },
  secondaryText: { color: COLORS.teal, fontWeight: '800' },
  primaryMini: { backgroundColor: COLORS.teal, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 22 },
  primaryMiniText: { color: COLORS.white, fontWeight: '800' },
  composer: { marginHorizontal: 16, minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, borderRadius: 18, borderWidth: 1.5, borderColor: '#9AA3A3', paddingHorizontal: 10 },
  attach: { width: 34, height: 34, borderWidth: 2, borderColor: '#A5AAAA', borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  attachText: { fontSize: 25, color: '#929797', lineHeight: 27 },
  composerInput: { flex: 1, fontSize: 17, color: COLORS.ink },
  send: { fontSize: 31, color: COLORS.tealDark },
  bottomNav: { height: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 4, borderTopColor: COLORS.ink, marginHorizontal: 28, marginTop: 14 },
  navItem: { alignItems: 'center', minWidth: 80 },
  navIcon: { color: COLORS.ink, fontSize: 35, lineHeight: 39 },
  navLabel: { color: COLORS.ink, fontSize: 13 },
  navActive: { fontWeight: '900' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(8,32,32,0.58)', justifyContent: 'center', padding: 18 },
  modalScroll: { flexGrow: 1, justifyContent: 'center' },
  modalCard: { backgroundColor: COLORS.white, borderRadius: 28, padding: 20, gap: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  modalClose: { color: COLORS.ink, textDecorationLine: 'underline', fontSize: 16 },
  modalTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '900' },
  modalImage: { alignSelf: 'center', width: 180, height: 190 },
  modalProductTitle: { color: COLORS.black, fontSize: 19, fontWeight: '900' },
  modalDescription: { color: COLORS.muted, fontSize: 14, lineHeight: 20 },
  estimated: { color: COLORS.black, fontSize: 16 },
  estimatedValue: { color: COLORS.ink, fontWeight: '900', fontSize: 18 },
  controlLabel: { color: COLORS.black, fontSize: 15 },
  stepper: { flexDirection: 'row', height: 44, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#7A8989', borderRadius: 10, paddingHorizontal: 8 },
  stepButton: { width: 34, alignItems: 'center' },
  stepText: { color: COLORS.ink, fontSize: 24 },
  quantity: { color: COLORS.black, fontSize: 17, fontWeight: '700' },
  colorRow: { gap: 8 },
  swatches: { flexDirection: 'row', gap: 10 },
  swatch: { width: 31, height: 31, borderRadius: 16, borderWidth: 1, borderColor: '#C7CCCC' },
  swatchSelected: { borderWidth: 3, borderColor: COLORS.teal },
  historyContent: { padding: 22, gap: 14 },
  pageTitle: { color: COLORS.ink, fontSize: 26, fontWeight: '900', marginBottom: 8 },
  historyCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  historyTitle: { color: COLORS.ink, fontWeight: '800', fontSize: 16 },
  historyMeta: { color: COLORS.muted, marginTop: 5 },
  historyValue: { color: COLORS.teal, fontWeight: '900' },
  emptyHint: { marginTop: 20, flexDirection: 'row', gap: 12, alignItems: 'center' },
  historyBot: { width: 64, height: 64, borderRadius: 32 },
  emptyText: { flex: 1, color: COLORS.ink, lineHeight: 20 },
  profilePage: { flex: 1, padding: 28, alignItems: 'stretch' },
  back: { color: COLORS.ink, fontSize: 18, fontWeight: '700' },
  profileAvatar: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginTop: 28, marginBottom: 16 },
  profileCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, gap: 8, marginVertical: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  profileLabel: { color: COLORS.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: '800', marginTop: 10 },
  profileValue: { color: COLORS.ink, fontSize: 17, fontWeight: '700' },
});


