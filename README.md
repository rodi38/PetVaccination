# PetVaccination

App mobile do PetVac (React Native), para cadastro de pets e controle de suas vacinações. Consome a API [PetVacApi](https://github.com/rodi38/PetVacApi).

## Sumário

- [Stack](#stack)
- [Estrutura](#estrutura)
- [Autenticação e sessão](#autenticação-e-sessão)
- [Configuração](#configuração)
- [Como rodar](#como-rodar)

## Stack

- **React Native 0.76** + **TypeScript**
- **React Navigation** (`stack`/`native-stack`) — navegação
- **axios** — cliente HTTP
- **@react-native-async-storage/async-storage** — persistência local de sessão (`@token`, `@user`)
- **jwt-decode** — checagem de expiração do JWT no cliente
- **react-native-paper** — componentes de UI (Material Design)
- **react-native-config** — variáveis de ambiente (`API_URL`)
- **react-native-image-picker** + **react-native-fs** — foto do pet (armazenada localmente no dispositivo)
- **react-native-toast-message** — feedback de erros/sucesso
- **Jest** — testes

## Estrutura

```
src/
  App.tsx                    # providers globais (Paper, SafeArea, GestureHandler, AuthProvider, Toast)
  routes/index.tsx           # Stack Navigator; alterna rotas autenticadas/públicas conforme AuthContext
  contexts/AuthContext.tsx   # estado global de sessão (user, loading, signIn/signOut/register)
  services/
    api.ts                   # instância axios, injeta/remove Bearer token, desembrulha { success, data, error }
    AuthService.ts           # login/register/update/logout, expiração de token, persistência em AsyncStorage
    PetService.ts            # chamadas de /pets
    VaccineService.ts        # chamadas de /vaccines e vacinações
    LocalImageService.ts     # leitura/gravação da foto do pet no filesystem local
  screens/                   # Login, Register, HomeScreen, PetDetails, AddPet, AddVaccination(Screen),
                              # AddVaccineTypeScreen, VaccinationDetailsScreen, ProfileScreen
  hooks/
    useRequest.ts             # wrapper de chamada de API com loading/erro padronizados
    useFormValidation.tsx     # validação de formulários
  types/
    index.ts                  # tipos de domínio (User, Pet, Vaccine, ...)
    navigation.ts              # RootStackParamList e props tipadas de cada tela
    errors.ts                  # tipos de erro da API
```

## Autenticação e sessão

- `api.ts` centraliza a instância axios: `setAuthToken` grava/remove o token no `AsyncStorage` e no header `Authorization`; o interceptor de resposta desembrulha o envelope `{ success, data, error }` da API para `response.data`.
- Em qualquer resposta `401`, o interceptor limpa a sessão (`@token`/`@user`) e chama `globalThis.forceLogout` (atribuído pelo `AuthContext` ao `signOut`), derrubando o usuário para a tela de login.
- `AuthService.loadAuthData` roda no boot do app (via `AuthContext`): decodifica o JWT salvo, verifica expiração local com `jwt-decode` e, se válido, restaura o header `Authorization`.
- `routes/index.tsx` decide entre o stack autenticado (Home, PetDetails, AddPet, Profile, AddVaccination, VaccinationDetails, AddVaccineType) e o público (Login, Register) com base em `user` do `AuthContext`.

## Configuração

Variável de ambiente definida via `react-native-config` (arquivo `.env`, veja `.env.example`):

| Variável  | Descrição                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `API_URL` | URL base da API, incluindo o prefixo `/api/v1` (ex: `http://10.0.2.2:5000/api/v1` no emulador Android, que aponta para o `localhost` da máquina host) |

## Como rodar

Pré-requisitos: ambiente React Native configurado ([guia oficial](https://reactnative.dev/docs/environment-setup)), e a [PetVacApi](../PetVacApi) rodando.

```bash
npm install
cp .env.example .env   # ajustar API_URL

npm start               # inicia o Metro bundler

npm run android         # em outro terminal, com emulador/dispositivo Android conectado
npm run ios             # ou com simulador/dispositivo iOS (macOS)
```

Testes e lint:

```bash
npm test
npm run lint       # eslint + tsc --noEmit
```
