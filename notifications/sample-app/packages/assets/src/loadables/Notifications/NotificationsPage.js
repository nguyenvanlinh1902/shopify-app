import Loadable from 'react-loadable';
import Loading from '@assets/components/Loading';

export default Loadable({
  loader: () => import("../../pages/Notifications/NotificationsPage"),
  loading: Loading
});
