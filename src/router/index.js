import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  { 
    path: '/explorer', 
    name: 'explorer', 
    component: () => import('../views/ExplorerView.vue'),
    meta: { title: 'Explorer' }
  },
  { 
    path: '/schedule', 
    name: 'schedule', 
    component: () => import('../views/ScheduleView.vue'),
    meta: { title: 'Release Schedule' }
  },
  { 
    path: '/about-us', 
    name: 'about', 
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'About Developer' }
  },
  {
    path: '/status',
    name: 'status',
    component: () => import('../views/StatusView.vue'),
    meta: { title: 'System Status' }
  },
  {
    // 🚀 FIXED: Nama file komponen ChangelogView.vue gais
    path: '/changelog',
    name: 'changelog',
    component: () => import('../views/ChangeLogsView.vue'),
    meta: { title: 'System Logs' }
  },
  {
    // 🚀 FIXED: Nama file komponen TermsView.vue gais
    path: '/privacy-policy',
    name: 'privacy',
    component: () => import('../views/TermsView.vue'),
    meta: { title: 'Privacy & Terms' }
  },
  {
    // 🚀 FIXED: Nama file komponen APIView.vue gais
    path: '/api-docs',
    name: 'api',
    component: () => import('../views/APIDocsView.vue'),
    meta: { title: 'API Protocols' }
  },
  {
    path: '/anime/:id',
    name: 'anime-show',
    component: () => import('../views/AnimeShowView.vue'),
    props: true,
    meta: { title: 'Anime Details' }
  },

  // --- RUTE ERROR / 404 GAIS ---
  {
    path: '/404',
    name: 'not-found',
    component: () => import('../views/ErrorView.vue'),
    meta: { title: '404 - Neural Link Lost' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// --- 🚀 SMART NAVIGATION GUARD GAIS ---
router.beforeEach((to, from, next) => {
  const baseTitle = "Ududnime";
  // Mengambil title dari meta rute agar lebih rapi gais
  const pageTitle = to.meta.title || "Neural System";
  
  document.title = `${baseTitle} | ${pageTitle}`;
  next();
});

export default router