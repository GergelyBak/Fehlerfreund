import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { I18nProvider } from './i18n/I18nProvider'
import { RequireAuth } from './auth/RequireAuth'
import { Layout } from './components/Layout'
import { ChatPage } from './pages/ChatPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { GrammarPage } from './pages/GrammarPage'
import { GrammarTopicPage } from './pages/GrammarTopicPage'
import { SituationsPage } from './pages/SituationsPage'
import { StatsPage } from './pages/StatsPage'
import { VocabPage } from './pages/VocabPage'
import { VocabThemePage } from './pages/VocabThemePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReviewPage } from './pages/ReviewPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <I18nProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route index element={<SituationsPage />} />
              <Route path="chat/:id" element={<ChatPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="grammar" element={<GrammarPage />} />
              <Route path="grammar/:id" element={<GrammarTopicPage />} />
              <Route path="vocab" element={<VocabPage />} />
              <Route path="vocab/:id" element={<VocabThemePage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </I18nProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
