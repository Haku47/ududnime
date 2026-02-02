import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: () => import('../views/HomeView.vue') 
  },
  { 
    path: '/explorer', 
    name: 'explorer', 
    component: () => import('../views/ExplorerView.vue') 
  },
  { 
    path: '/schedule', 
    name: 'schedule', 
    component: () => import('../views/ScheduleView.vue') 
  },
  { 
    path: '/about-us', 
    name: 'about', 
    component: () => import('../views/AboutView.vue') 
  },

  {
  path: '/status',
  name: 'status',
  component: () => import('../views/StatusView.vue') // Pastikan file View-nya sudah ada gais
  },

  {
  path: '/anime/:id',
  name: 'anime-show',
  component: () => import('../views/AnimeShowView.vue')
  },

  // --- RUTE ERROR / 404 GAIS ---
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/ErrorView.vue')
  },
  // Catch-all route: kalau user nyasar, lempar ke 404 gais
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Otomatis scroll ke atas setiap pindah halaman gais
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router