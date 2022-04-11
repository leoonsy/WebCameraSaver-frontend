import { computed } from 'vue';
import type { Router } from 'vue-router';

export default (router: Router) => ({
  selectedTab: computed({
    get: () => router.currentRoute.value.name as string,
    set: (name) => {
      router.push({ name });
    },
  }),
});
