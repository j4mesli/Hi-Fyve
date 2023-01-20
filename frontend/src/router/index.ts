import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import MyHiFyve from '../views/MyHiFyve.vue'
import SynesthesiaMain from '../views/SynesthesiaMain.vue'
import WorldwydeView from '../views/WorldwydeView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'

// use main.css
import '../../public/main.css';
import { refreshAccessToken } from '@/components/functions/refreshAccessToken';

// route guard to refresh token on every page load if logged in
const refreshOnLoad = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (localStorage.length > 0) {
    await refreshAccessToken(localStorage.refresh_token)
    .then(res => next())
    .catch(err => next());
  }
  else {
    next();
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/MyHiFyve',
    name: 'MyHiFyve',
    component: MyHiFyve,
  },
  {
    path: '/Synesthesia',
    name: 'Synesthesia',
    component: SynesthesiaMain,
  },
  {
    path: '/Analytics',
    name: 'Analytics',
    component: AnalyticsView,
  },
  {
    path: '/Worldwyde',
    name: 'Worldwyde',
    component: WorldwydeView,
  },
  // redirect user to /Worldwyde from /Worldwide
  {
    path: '/Worldwide',
    redirect: { name: 'Worldwyde' },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
