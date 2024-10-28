import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Cursos List',
    path: '/courselist',
    icon: icon('ic_blog'),
  },
  {
    title: 'Notificaciones',
    path: '/notification',
    icon: icon('ic_user'),
  },
  {
    title: 'Eventos',
    path: '/event',
    icon: icon('ic_user'),
  },
  {
    title: 'Usuarios',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {/*
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  */},
];

export default navConfig;
