import { defineStore } from 'pinia'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useUserStore } from './user'
import { shouldTrackAnalytics } from '@/utils/environment'

export const useAnalyticsStore = defineStore('analytics', () => {
  const eventsCollection = collection(db, 'analytics-events')

  /**
   * Track an analytics event - sends to Firestore in production, logs to console in development
   * @param {string} eventType - Type of event (user_onboarded, material_clicked, etc.)
   * @param {Object} metadata - Additional event metadata
   */
  async function trackEvent(eventType, metadata = {}) {
    const userStore = useUserStore()

    const event = {
      eventType,
      timestamp: serverTimestamp(),
      userId: userStore.name || 'anonymous',
      userGroup: userStore.group || null,
      ...metadata,
    }

    // Only track analytics if not running on localhost
    if (!shouldTrackAnalytics()) {
      console.log('[Analytics - Local Only]', eventType, {
        ...event,
        timestamp: new Date().toISOString(),
      })
      return
    }

    try {
      await addDoc(eventsCollection, event)
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // Event tracking methods for different actions

  function trackUserOnboarded(name, group) {
    trackEvent('user_onboarded', { name, group })
  }

  function trackMaterialClicked(materialType, materialName, classId, className) {
    trackEvent('material_clicked', {
      materialType, // 'presentation', 'note', 'video'
      materialName,
      classId,
      className,
    })
  }

  function trackQuizStarted(classId, className, questionCount) {
    trackEvent('quiz_started', {
      classId,
      className,
      questionCount,
    })
  }

  function trackQuestionAnswered(questionId, classId, questionType, isCorrect, attemptNumber) {
    trackEvent('question_answered', {
      questionId,
      classId,
      questionType, // 'višestruki_izbor' or 'otvoreno'
      isCorrect,
      attemptNumber,
    })
  }

  function trackQuizCompleted(classId, className, correctAnswers, totalQuestions, duration) {
    trackEvent('quiz_completed', {
      classId,
      className,
      correctAnswers,
      totalQuestions,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      duration, // in milliseconds
    })
  }

  function trackPageView(pageName) {
    trackEvent('page_view', { pageName })
  }

  return {
    trackEvent,
    trackUserOnboarded,
    trackMaterialClicked,
    trackQuizStarted,
    trackQuestionAnswered,
    trackQuizCompleted,
    trackPageView,
  }
})
