<script setup>
defineProps({
  classData: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="class-card">
    <div class="card-header">
      <h3 class="class-name">{{ classData.name }}</h3>
      <span class="class-type" :class="classData.type.toLowerCase()">
        {{ classData.type }}
      </span>
    </div>

    <div class="card-materials">
      <h4 class="materials-title">Materijali</h4>

      <!-- Presentations Section -->
      <div v-if="classData.materials.presentations.length > 0" class="material-section">
        <div class="section-header">
          <span class="material-icon">📊</span>
          <span class="section-label">Prezentacije</span>
        </div>
        <div class="material-links">
          <a
            v-for="(item, index) in classData.materials.presentations"
            :key="`presentation-${index}`"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="material-link"
          >
            {{ item.name }}
          </a>
        </div>
      </div>

      <!-- Notes Section -->
      <div v-if="classData.materials.notes.length > 0" class="material-section">
        <div class="section-header">
          <span class="material-icon">📝</span>
          <span class="section-label">Bilješke</span>
        </div>
        <div class="material-links">
          <a
            v-for="(item, index) in classData.materials.notes"
            :key="`note-${index}`"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="material-link"
          >
            {{ item.name }}
          </a>
        </div>
      </div>

      <!-- Videos Section -->
      <div v-if="classData.materials.videos.length > 0" class="material-section">
        <div class="section-header">
          <span class="material-icon">🎥</span>
          <span class="section-label">Videosnimke</span>
        </div>
        <div class="material-links">
          <a
            v-for="(item, index) in classData.materials.videos"
            :key="`video-${index}`"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="material-link"
          >
            {{ item.name }}
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          classData.materials.presentations.length === 0 &&
          classData.materials.notes.length === 0 &&
          classData.materials.videos.length === 0
        "
        class="empty-materials"
      >
        <p>Još nema dostupnih materijala</p>
      </div>
    </div>

    <div class="card-footer">
      <RouterLink :to="`/quiz/${classData.id}`" class="quiz-button">
        <span class="quiz-icon">📝</span>
        Zapocni kviz
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.class-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.class-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.class-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.class-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.class-type.live {
  background-color: #e3f2fd;
  color: #1976d2;
}

.class-type.online {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.materials-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #606060;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.material-section {
  margin-bottom: 1.25rem;
}

.material-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #606060;
}

.section-label {
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.material-icon {
  font-size: 1rem;
}

.material-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.5rem;
}

.material-link {
  display: block;
  padding: 0.625rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.material-link:hover {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
  transform: translateX(4px);
}

.empty-materials {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}

.empty-materials p {
  margin: 0;
}

.card-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.quiz-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.quiz-icon {
  font-size: 1.125rem;
}
</style>
