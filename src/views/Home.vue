<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useClassesStore } from '@/stores/classes'
import { useAnalyticsStore } from '@/stores/analytics'
import { getOrderedExams } from '@/config/exams'
import ClassCard from '@/components/ClassCard.vue'

const userStore = useUserStore()
const classesStore = useClassesStore()
const analyticsStore = useAnalyticsStore()

const examGroups = computed(() =>
  getOrderedExams().map((exam) => ({
    exam,
    classes: exam.classIds.map((id) => classesStore.getClassById(id)).filter(Boolean),
  })),
)

const expandedExam = ref(null)

function toggleExam(examId) {
  expandedExam.value = expandedExam.value === examId ? null : examId
}

const inputName = ref('')
const selectedGroup = ref('')
const isSubmitting = ref(false)

function handleSubmit() {
  const trimmedName = inputName.value.trim()
  if (trimmedName && selectedGroup.value) {
    isSubmitting.value = true
    userStore.setUserData(trimmedName, selectedGroup.value)
    analyticsStore.trackUserOnboarded(trimmedName, selectedGroup.value)
  }
}
</script>

<template>
  <div class="home-container">
    <div v-if="!userStore.hasName()" class="welcome-card">
      <h1>Dobrodošli u UEFA C materijale</h1>
      <p>Molimo unesite svoje ime i grupu za početak</p>

      <form @submit.prevent="handleSubmit" class="name-form">
        <div class="input-with-tooltip">
          <input
            v-model="inputName"
            type="text"
            placeholder="Unesite svoje ime"
            required
            class="name-input"
            autofocus
          />
          <div class="info-icon-wrapper">
            <span class="info-icon">ℹ️</span>
            <div class="info-tooltip">
              Ne morate unositi puno ime. Možete koristiti nadimak ili skraćeno ime.
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="group-select" class="form-label">Odaberite svoju grupu:</label>
          <select id="group-select" v-model="selectedGroup" required class="group-select">
            <option value="" disabled>Odaberite grupu</option>
            <option value="Grupa 1">Grupa 1</option>
            <option value="Grupa 2">Grupa 2</option>
            <option value="Grupa 3">Grupa 3</option>
            <option value="Grupa 4">Grupa 4</option>
            <option value="Grupa 5">Grupa 5</option>
            <option value="Grupa 6">Grupa 6</option>
          </select>
        </div>

        <button type="submit" class="submit-button">Nastavi</button>
      </form>
    </div>

    <div v-else class="dashboard">
      <div class="dashboard-header">
        <h1>Moji predmeti</h1>
        <p>Pristupite materijalima i resursima za vaše predmete</p>
      </div>

      <div class="exam-list">
        <div v-for="group in examGroups" :key="group.exam.id" class="exam-item">
          <button
            class="exam-card"
            :class="{ expanded: expandedExam === group.exam.id }"
            :style="{ borderLeftColor: group.exam.color }"
            @click="toggleExam(group.exam.id)"
          >
            <div class="exam-card-info">
              <h2 class="exam-name">{{ group.exam.name }}</h2>
              <p class="exam-description">{{ group.exam.description }}</p>
              <span class="exam-count">
                {{ group.classes.length }}
                {{ group.classes.length === 1 ? 'predmet' : 'predmeta' }}
              </span>
            </div>
            <span class="expand-icon">{{ expandedExam === group.exam.id ? '▲' : '▼' }}</span>
          </button>

          <div v-if="expandedExam === group.exam.id" class="classes-grid">
            <ClassCard
              v-for="classItem in group.classes"
              :key="classItem.id"
              :class-data="classItem"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  padding: 3rem 2rem;
}

.welcome-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.welcome-card h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-card p {
  color: #606060;
  margin-bottom: 2rem;
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.input-with-tooltip {
  position: relative;
  width: 100%;
}

.info-icon-wrapper {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
}

.info-icon {
  font-size: 1.125rem;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.2s;
  user-select: none;
}

.info-icon-wrapper:hover .info-icon {
  opacity: 1;
}

.info-tooltip {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 280px;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 0.2s ease;
  pointer-events: none;
  font-size: 0.875rem;
  color: #606060;
  line-height: 1.4;
  text-align: left;
  border: 1px solid #e0e0e0;
}

.info-icon-wrapper:hover .info-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.name-input,
.group-select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.name-input {
  width: 100%;
  padding-right: 3rem;
}

.name-input:focus,
.group-select:focus {
  outline: none;
  border-color: #42b983;
}

.group-select {
  background-color: white;
  cursor: pointer;
}

.submit-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #359268;
}

.dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #606060;
  font-size: 1.125rem;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exam-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: white;
  border: none;
  border-left: 4px solid;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.exam-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
  transform: translateY(-2px);
}

.exam-card.expanded {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.exam-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exam-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.exam-description {
  color: #606060;
  margin: 0;
  font-size: 0.9rem;
}

.exam-count {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
}

.expand-icon {
  font-size: 0.875rem;
  color: #999;
  flex-shrink: 0;
  margin-left: 1rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0 0.5rem;
}
</style>
