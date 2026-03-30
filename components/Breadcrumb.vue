<template>
  <nav class="mb-6 text-sm" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <!-- Home Link -->
      <li>
        <NuxtLink
          to="/"
          class="text-[#c58229] hover:text-[#a55e1f] transition-colors font-medium"
        >
          Beranda
        </NuxtLink>
      </li>
      <!-- Parent Link if exists -->
      <template v-if="parentTitle">
        <li>
          <span class="mx-2 text-gray-400">></span>
        </li>
        <li>
          <NuxtLink
            :to="parentPath"
            class="text-[#c58229] hover:text-[#a55e1f] transition-colors font-medium"
          >
            {{ parentTitle }}
          </NuxtLink>
        </li>
      </template>
      <!-- Separator -->
      <li>
        <span class="mx-2 text-gray-400">></span>
      </li>
      <!-- Current Page -->
      <li class="text-gray-500">
        {{ title }}
      </li>
    </ol>
  </nav>
</template>

<script setup>
// Props
const props = defineProps({
  title: { type: String, required: true },  // e.g., "Sejarah Paroki"
  path: { type: String, default: '' },  // Optional: Jika ingin link ke parent
  parentTitle: { type: String, default: '' },
  parentPath: { type: String, default: '' }
})

const route = useRoute()
const siteUrl = 'https://stpaulusjuanda.org'
const currentPath = props.path || route.path

// Optional: JSON-LD for SEO (Breadcrumb Schema)
const itemListElement = [
  {
    '@type': 'ListItem',
    position: 1,
    name: 'Paroki St. Paulus Juanda',
    item: `${siteUrl}/`
  }
];

if (props.parentTitle) {
  itemListElement.push({
    '@type': 'ListItem',
    position: 2,
    name: props.parentTitle,
    item: `${siteUrl}${props.parentPath}`
  });
  itemListElement.push({
    '@type': 'ListItem',
    position: 3,
    name: props.title,
    item: `${siteUrl}${currentPath}`
  });
} else {
  itemListElement.push({
    '@type': 'ListItem',
    position: 2,
    name: props.title,
    item: `${siteUrl}${currentPath}`
  });
}

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    })
  }]
})
</script>

<style scoped>
/* No additional styles - All Tailwind */
</style>
