import { createRouter, createWebHistory } from "@ionic/vue-router";
import TabsPage from "@/views/TabsPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/tabs/list"
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "list",
        component: () => import("@/views/ListExpense.vue")
      },
      {
        path: "add",
        component: () => import("@/views/AddExpense.vue")
      },
      {
        path: "edit/:id",
        component: () => import("@/views/EditExpense.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
