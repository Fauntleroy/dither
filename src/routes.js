import Index from './routes/index.svelte'
import Room from './routes/rooms/[id].svelte';
import Layout from './routes/_layout.svelte';

const routes = [
  {
    name: '/',
    component: Index,
    layout: Layout
  },
  {
    name: '/rooms/:id',
    component: Room,
    layout: Layout
  }
];

export default routes;