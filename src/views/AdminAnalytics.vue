<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const events = ref([])
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadAnalytics()
})

async function loadAnalytics() {
  try {
    isLoading.value = true
    const eventsQuery = query(collection(db, 'analytics-events'), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(eventsQuery)

    events.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string for display
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))

    isLoading.value = false
  } catch (err) {
    console.error('Failed to load analytics:', err)
    error.value = 'Greška pri učitavanju podataka'
    isLoading.value = false
  }
}

// Computed statistics
const totalUsers = computed(() => {
  const uniqueUsers = new Set(events.value.map((e) => e.userId))
  return uniqueUsers.size
})

const totalEvents = computed(() => events.value.length)

const usersByGroup = computed(() => {
  const groupCounts = {}
  const userGroups = new Map()

  events.value.forEach((e) => {
    if (e.userId && e.userGroup) {
      userGroups.set(e.userId, e.userGroup)
    }
  })

  userGroups.forEach((group) => {
    groupCounts[group] = (groupCounts[group] || 0) + 1
  })

  return groupCounts
})

const materialStats = computed(() => {
  const materialClicks = events.value.filter((e) => e.eventType === 'material_clicked')
  const stats = {
    total: materialClicks.length,
    byType: {},
    byClass: {},
  }

  materialClicks.forEach((event) => {
    const type = event.materialType
    const classId = event.classId

    stats.byType[type] = (stats.byType[type] || 0) + 1
    stats.byClass[classId] = (stats.byClass[classId] || 0) + 1
  })

  return stats
})

const quizStats = computed(() => {
  const quizStarts = events.value.filter((e) => e.eventType === 'quiz_started')
  const quizCompletions = events.value.filter((e) => e.eventType === 'quiz_completed')
  const questionAnswers = events.value.filter((e) => e.eventType === 'question_answered')

  return {
    totalQuizStarts: quizStarts.length,
    totalQuizCompletions: quizCompletions.length,
    completionRate:
      quizStarts.length > 0
        ? Math.round((quizCompletions.length / quizStarts.length) * 100)
        : 0,
    totalQuestionsAnswered: questionAnswers.length,
    correctAnswers: questionAnswers.filter((e) => e.isCorrect).length,
    overallAccuracy:
      questionAnswers.length > 0
        ? Math.round(
            (questionAnswers.filter((e) => e.isCorrect).length / questionAnswers.length) * 100,
          )
        : 0,
  }
})

const activityByDay = computed(() => {
  const activityMap = new Map()

  events.value.forEach((event) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0]
    activityMap.set(date, (activityMap.get(date) || 0) + 1)
  })

  return Array.from(activityMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
})

function exportData() {
  const data = {
    exportDate: new Date().toISOString(),
    totalEvents: totalEvents.value,
    totalUsers: totalUsers.value,
    usersByGroup: usersByGroup.value,
    materialClickStats: materialStats.value,
    quizStats: quizStats.value,
    activityByDay: activityByDay.value,
    allEvents: events.value,
  }

  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `uefa-c-analytics-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

async function handleLogout() {
  await adminStore.logout()
  router.push('/admin/login')
}

async function refreshData() {
  await loadAnalytics()
}
</script>

<template>
  <div class="analytics-container">
    <div v-if="isLoading" class="loading-state">
      <p>Učitavanje podataka...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="refreshData" class="retry-button">Pokušaj ponovno</button>
    </div>

    <div v-else class="analytics-content">
      <div class="header">
        <div>
          <h1>Analitika korištenja</h1>
          <p class="admin-info">
            Prijavljeni kao: <strong>{{ adminStore.adminUser?.email }}</strong>
          </p>
        </div>
        <div class="header-actions">
          <button @click="refreshData" class="refresh-button">🔄 Osvježi</button>
          <button @click="exportData" class="export-button">📊 Izvezi podatke</button>
          <button @click="handleLogout" class="logout-button">🚪 Odjavi se</button>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Ukupno korisnika</div>
          <div class="stat-value">{{ totalUsers }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Ukupno događaja</div>
          <div class="stat-value">{{ totalEvents }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Klikova na materijale</div>
          <div class="stat-value">{{ materialStats.total }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Pokušaja kviza</div>
          <div class="stat-value">{{ quizStats.totalQuizStarts }}</div>
        </div>
      </div>

      <!-- Users by Group -->
      <section class="section">
        <h2>Korisnici po grupama</h2>
        <div class="group-stats">
          <div v-for="(count, group) in usersByGroup" :key="group" class="group-item">
            <span class="group-name">{{ group }}</span>
            <span class="group-count">{{ count }} korisnika</span>
          </div>
          <div v-if="Object.keys(usersByGroup).length === 0" class="empty-state">
            Još nema podataka o grupama
          </div>
        </div>
      </section>

      <!-- Quiz Statistics -->
      <section class="section">
        <h2>Statistika kvizova</h2>
        <div class="quiz-stats-grid">
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Ukupno pokušaja</div>
            <div class="quiz-stat-value">{{ quizStats.totalQuizStarts }}</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Završenih kvizova</div>
            <div class="quiz-stat-value">{{ quizStats.totalQuizCompletions }}</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Stopa dovršenosti</div>
            <div class="quiz-stat-value">{{ quizStats.completionRate }}%</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Ukupno odgovora</div>
            <div class="quiz-stat-value">{{ quizStats.totalQuestionsAnswered }}</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Točnih odgovora</div>
            <div class="quiz-stat-value">{{ quizStats.correctAnswers }}</div>
          </div>
          <div class="quiz-stat-item">
            <div class="quiz-stat-label">Ukupna točnost</div>
            <div class="quiz-stat-value">{{ quizStats.overallAccuracy }}%</div>
          </div>
        </div>
      </section>

      <!-- Material Click Statistics -->
      <section class="section">
        <h2>Klikovi na materijale po tipu</h2>
        <div class="material-type-stats">
          <div
            v-for="(count, type) in materialStats.byType"
            :key="type"
            class="material-type-item"
          >
            <span class="material-type-name">{{ type }}</span>
            <span class="material-type-count">{{ count }} klikova</span>
          </div>
          <div v-if="Object.keys(materialStats.byType).length === 0" class="empty-state">
            Još nema podataka o klikovima
          </div>
        </div>
      </section>

      <!-- Activity Timeline -->
      <section class="section">
        <h2>Aktivnost po danima</h2>
        <div class="activity-timeline">
          <div
            v-for="activity in activityByDay.slice(-14)"
            :key="activity.date"
            class="activity-item"
          >
            <span class="activity-date">{{ activity.date }}</span>
            <div class="activity-bar-container">
              <div
                class="activity-bar"
                :style="{
                  width: `${(activity.count / Math.max(...activityByDay.map((a) => a.count))) * 100}%`,
                }"
              ></div>
              <span class="activity-count">{{ activity.count }}</span>
            </div>
          </div>
          <div v-if="activityByDay.length === 0" class="empty-state">
            Još nema podataka o aktivnosti
          </div>
        </div>
      </section>

      <!-- Export Info -->
      <section class="section export-info">
        <h2>O podacima</h2>
        <p>
          Svi podaci o korištenju aplikacije spremaju se u Firebase Firestore bazu podataka. Možete
          ih izvesti u JSON formatu klikom na gumb "Izvezi podatke" gore.
        </p>
        <p>
          Izvezeni podaci uključuju sve događaje korisnika, statistiku po grupama, podatke o
          kvizovima i aktivnosti, što možete koristiti za analizu i pisanje blog posta.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading-state p,
.error-state p {
  color: #606060;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #359268;
}

.analytics-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.admin-info {
  color: #606060;
  font-size: 0.9rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.refresh-button,
.export-button,
.logout-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.refresh-button {
  background-color: #6c757d;
  color: white;
}

.refresh-button:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.export-button {
  background-color: #42b983;
  color: white;
}

.export-button:hover {
  background-color: #359268;
  transform: translateY(-2px);
}

.logout-button {
  background-color: #dc3545;
  color: white;
}

.logout-button:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.section {
  margin-bottom: 2.5rem;
}

.section h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.group-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.group-name {
  font-weight: 600;
  color: #2c3e50;
}

.group-count {
  color: #606060;
}

.quiz-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.quiz-stat-item {
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.quiz-stat-label {
  font-size: 0.875rem;
  color: #606060;
  margin-bottom: 0.5rem;
}

.quiz-stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
}

.material-type-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.material-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.material-type-name {
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
}

.material-type-count {
  color: #606060;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1rem;
  align-items: center;
}

.activity-date {
  font-size: 0.875rem;
  color: #606060;
  font-weight: 500;
}

.activity-bar-container {
  position: relative;
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 28px;
  display: flex;
  align-items: center;
}

.activity-bar {
  background: linear-gradient(90deg, #42b983 0%, #359268 100%);
  height: 100%;
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.3s;
}

.activity-count {
  position: absolute;
  right: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-style: italic;
}

.export-info {
  background-color: #fff3cd;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.export-info h2 {
  border-bottom: none;
  margin-bottom: 0.75rem;
}

.export-info p {
  color: #856404;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.export-info p:last-child {
  margin-bottom: 0;
}
</style>
