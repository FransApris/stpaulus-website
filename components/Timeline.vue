<template>
  <div class="timeline">
    <div v-for="group in groupedItems" :key="group.date" class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <!-- Date Badge -->
        <div class="timeline-date-wrapper">
          <div class="timeline-date-badge">
            <svg class="w-4 h-4 md:w-5 md:h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="timeline-date">{{ group.date }}</span>
          </div>
        </div>

        <!-- Events Grid -->
        <div class="timeline-events-grid">
          <div v-for="item in group.items" :key="item.id" class="timeline-event">
            <div class="flex items-start gap-3">
              <!-- Event Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 md:w-10 md:h-10 bg-[#882f1d] rounded-full flex items-center justify-center shadow-md">
                  <svg v-if="item.type === 'news'" class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                    </path>
                  </svg>
                  <svg v-else class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                    </path>
                  </svg>
                </div>
              </div>

              <!-- Event Content -->
              <div class="flex-1 min-w-0">
                <h3 class="timeline-title">
                  <NuxtLink :to="item.link" class="hover:text-[#882f1d] transition-colors">
                    {{ item.title }}
                  </NuxtLink>
                </h3>
                <p v-if="item.excerpt" class="timeline-excerpt">{{ item.excerpt }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="timeline-type">
                    {{ item.type === 'news' ? '📰 Berita' : '📅 Agenda' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const groupedItems = computed(() => {
  const groups = {}
  props.items.forEach(item => {
    const date = formatDate(item.date)
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })
  return Object.entries(groups).map(([date, items]) => ({ date, items }))
})
</script>

<style scoped>
/* Modern Timeline - Mobile First */
.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #882f1d, #882f1d80);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-marker {
  position: absolute;
  left: -16px;
  top: 8px;
  width: 16px;
  height: 16px;
  background: #882f1d;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #882f1d;
  z-index: 2;
}

.timeline-content {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(136, 47, 29, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f3f4f6;
}

.timeline-content:hover {
  box-shadow: 0 4px 16px rgba(136, 47, 29, 0.15);
  transform: translateY(-2px);
}

.timeline-date-wrapper {
  margin-bottom: 16px;
}

.timeline-date-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #882f1d, #a64931);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(136, 47, 29, 0.3);
}

.timeline-date {
  font-size: 0.875rem;
}

.timeline-events-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

.timeline-event {
  padding: 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 10px;
  border-left: 4px solid #882f1d;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.timeline-event:hover {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(136, 47, 29, 0.1);
  transform: translateX(4px);
}

.timeline-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timeline-excerpt {
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timeline-type {
  display: inline-block;
  background: linear-gradient(135deg, #e5e7eb, #f3f4f6);
  color: #374151;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Tablet and above */
@media (min-width: 640px) {
  .timeline {
    padding-left: 30px;
  }

  .timeline::before {
    left: 12px;
  }

  .timeline-marker {
    left: -22px;
    width: 20px;
    height: 20px;
    border: 4px solid white;
  }

  .timeline-content {
    padding: 20px;
  }

  .timeline-date-badge {
    font-size: 1rem;
    padding: 10px 20px;
  }

  .timeline-date {
    font-size: 1rem;
  }

  .timeline-events-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .timeline-event {
    padding: 20px;
  }

  .timeline-title {
    font-size: 1.05rem;
  }

  .timeline-excerpt {
    font-size: 0.9rem;
  }

  .timeline-type {
    font-size: 0.8rem;
    padding: 5px 14px;
  }
}

@media (min-width: 768px) {
  .timeline-events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .timeline-events-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Print optimization */
@media print {

  .timeline::before,
  .timeline-marker {
    display: none;
  }

  .timeline-content,
  .timeline-event {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    page-break-inside: avoid;
  }
}
</style>
