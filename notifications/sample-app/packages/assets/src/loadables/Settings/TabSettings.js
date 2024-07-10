import Loadable from 'react-loadable';
import Loading from '@assets/components/SettingsNotifications/TabSettings';

export default Loadable({
  loader: () => import('../../components/SettingsNotifications/TabSettings'),
  loading: Loading
});
